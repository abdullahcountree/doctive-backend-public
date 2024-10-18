const User = require('../models/user-model');

exports.GetDataBeforeCall = async (req, res) => {
    const { name, age, height, problem } = req.body;

    // Validation: Ensure all fields are provided
    if (!name || !age || !height || !problem) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newUser = new User({
            name,
            age,
            height,
            problem,
        });

        await newUser.save(); // Save the new user to the database

        res.status(201).json(newUser); // Return the newly created user
    } catch (error) {
        res.status(500).json({ message: 'Error saving user data', error });
    }
};
