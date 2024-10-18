const mongoose = require('mongoose'); // Import Mongoose
const userSchema = new mongoose.Schema({
    username: String,
    phoneNumber: { type: String, unique: true },
    role: String,
    about: String,
    height: { type: Number, required: true },
    problem: { type: String, required: true },
    otp: String
});

const User = mongoose.model('User', userSchema);
module.exports = User