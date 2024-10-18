


const Doctor = require('../models/doctor-model');
const upload = require('../multer-config');

exports.createDoctor = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        const { name, specialty, experience, contact, location, rating, symptoms } = req.body;
        const newDoctor = new Doctor({
            name,
            specialty,
            experience,
            contact,
            location,
            rating,
            image: req.file ? `/uploads/${req.file.filename}` : '', // Save image path
            symptoms
        });

        newDoctor.save()
            .then(doctor => res.status(201).json(doctor))
            .catch(error => res.status(500).json({ message: 'Error saving doctor', error }));
    });
};

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching doctors' });
    }
}


exports.getSymptomWithDoctors = async (req, res) => {
    const { id } = req.params;
    try {
        const symptom = await Symptom.findById(id);
        if (!symptom) {
            return res.status(404).json({ message: 'Symptom not found' });
        }

        // Log the symptom ID for debugging
        console.log('Symptom ID:', symptom._id);

        // Find doctors associated with this symptom
        const doctors = await Doctor.find({ symptoms: symptom._id });

        // Log doctors found for debugging
        console.log('Doctors found:', doctors);

        res.json({ symptom, doctors });
    } catch (err) {
        console.error('Error fetching symptom or doctors:', err);
        res.status(500).json({ message: 'Error fetching symptom or doctors' });
    }
};


exports.getHigherRatingDoctor = async (req, res) => {
    const { specialty } = req.query;

    const query = specialty ? { specialty } : {};

    try {
        const doctors = await Doctor.find(query)
            .sort({ rating: -1 })
            .limit(10);

        res.status(200).json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getHighestRatedDoctor = async (req, res) => {
    const { specialty } = req.query;

    // Create a base query to filter doctors with a rating higher than 4.5
    const query = {
        rating: { $gte: 4.5 } // Rating greater than 4.5
    };

    // If a specialty is provided, add it to the query
    if (specialty) {
        query.specialty = specialty;
    }

    try {
        const doctors = await Doctor.find(query)
            .sort({ rating: -1 }) // Sort by rating in descending order
            .limit(10); // Limit to the top 10 doctors

        res.status(200).json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
