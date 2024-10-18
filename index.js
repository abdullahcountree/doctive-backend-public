const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const authRoute = require('./routes/auth-route')
const docRoute = require('./routes/doctor-route')
const symptomRouter = require('./routes/symptoms-route');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const mongoose = require('mongoose');

const PORT = 5000;
const app = express();
const server = http.createServer(app);



// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/public', express.static('public'));

// MongoDB connection
mongoose.connect('mongodb+srv://sythertechnology:FW5xMHwpH3XZE9K7@cluster0.bvoet.mongodb.net/doctive', {})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


//endpoints
app.use('/api/user', authRoute)
app.use('/api/doctor', docRoute)
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);


const roomSchema = new mongoose.Schema({
    roomId: String,
    createdAt: { type: Date, default: Date.now },
});

const Room = mongoose.model('Room', roomSchema);


const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Endpoint to get all rooms (for doctors to see)
app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rooms', error });
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Patient creates/join a room
    socket.on('create-room', async (callback) => {
        try {
            const roomId = uuidv4(); // Generate unique room ID
            const newRoom = new Room({ roomId });
            await newRoom.save(); // Store the room in MongoDB

            socket.join(roomId); // Patient joins the room
            console.log(`Room created with ID: ${roomId}`);

            if (callback) callback(roomId); // Return the room ID
        } catch (error) {
            console.error('Error creating room:', error);
            if (callback) callback({ error: 'Error creating room' });
        }
    });

    // Doctor joins an existing room
    socket.on('join-room', async (roomId, callback) => {
        try {
            const room = await Room.findOne({ roomId }); // Find the room in MongoDB

            if (!room) {
                return callback({ error: 'Room not found' });
            }

            socket.join(roomId); // Doctor joins the room
            socket.to(roomId).emit('doctor-joined', roomId); // Notify the patient
            console.log(`Doctor joined room: ${roomId}`);
            if (callback) callback({ success: `Joined room: ${roomId}` });
        } catch (error) {
            console.error('Error joining room:', error);
            if (callback) callback({ error: 'Error joining room' });
        }
    });

    // Handle WebRTC offer from the patient
    socket.on('offer', ({ offer, roomId }) => {
        console.log(roomId)
        if (roomId) {
            console.log(`Offer sent in room: ${roomId}`);
            socket.to(roomId).emit('offer', offer);
        } else {
            console.log('Offer received with no roomId');
        }
    });

    // Handle WebRTC answer from the doctor
    socket.on('answer', ({ answer, roomId }) => {
        console.log(`Answer sent in room: ${roomId}`);
        socket.to(roomId).emit('answer', answer);
    });

    // Handle ICE candidates from both patient and doctor
    socket.on('ice-candidate', ({ candidate, roomId }) => {
        if (roomId) {
            console.log(`ICE candidate sent in room: ${roomId}`);
            socket.to(roomId).emit('ice-candidate', candidate);
        } else {
            console.log('ICE candidate received with no roomId');
        }
    });

    // Handle user disconnection
    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);

        // Find and remove the room if the patient (creator) disconnects
        const rooms = Object.keys(socket.rooms);
        for (const roomId of rooms) {
            const room = await Room.findOne({ roomId });
            if (room) {
                await Room.deleteOne({ roomId }); // Remove room from MongoDB
                io.in(roomId).emit('room-closed'); // Notify other users in the room
                console.log(`Room ${roomId} deleted due to patient disconnection`);
            }
        }
    });
});

// Start the server
server.listen(5000, () => {
    console.log('Server is running on port 5000');
});