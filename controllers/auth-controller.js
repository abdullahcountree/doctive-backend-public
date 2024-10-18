const User = require('../models/user-model')

// Twilio credentials



exports.registerUser = async (req, res) => {
    const { username, phoneNumber, role, about } = req.body;

    // Basic validation
    if (!username || !phoneNumber || !role || !about) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    // Check if user already exists
    try {
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({ username, phoneNumber, role, about });
        await newUser.save();
        return res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        return res.status(500).send({ message: 'Error creating user', error });
    }
}

exports.loginUser = async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).send({ message: 'Phone number is required' });
    }

    // Verify if user exists
    const user = await User.findOne({ phoneNumber });
    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP for ${phoneNumber}: ${otp}`); // Log OTP for debugging


}

exports.verifyOpt = async (req, res) => {
    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user || user.otp !== otp) {
        return res.status(400).send({ message: 'Invalid OTP' });
    }

    // OTP verified
    return res.status(200).send({ message: 'Login successful', user });
}

