const Symptom = require('../models/symptoms-model');
const Doctor = require('../models/doctor-model');

// Fetch all symptoms
exports.getAllSymptoms = async (req, res) => {
    try {
        const symptoms = await Symptom.find();
        res.json(symptoms);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching symptoms' });
    }
};

// Fetch a symptom by ID and related doctors
exports.getDoctors = async (req, res) => {
    const { id } = req.params;
    try {
        const symptom = await Symptom.findById(id);
        if (!symptom) {
            return res.status(404).json({ message: 'Symptom not found' });
        }
        const doctors = await Doctor.find({ symptoms: symptom._id.toString() });
        res.json({ symptom, doctors });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching symptom or doctors' });
    }
};

// Create a new symptom
exports.createSymptom = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newSymptom = new Symptom({ name, description });
        const savedSymptom = await newSymptom.save();
        res.status(201).json(savedSymptom);
    } catch (err) {
        res.status(500).json({ message: 'Error creating symptom', error: err });
    }
};

// Update a symptom by ID
exports.updateSymptom = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const updatedSymptom = await Symptom.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updatedSymptom) {
            return res.status(404).json({ message: 'Symptom not found' });
        }
        res.json(updatedSymptom);
    } catch (err) {
        res.status(500).json({ message: 'Error updating symptom', error: err });
    }
};

// Delete a symptom by ID
exports.deleteSymptom = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSymptom = await Symptom.findByIdAndDelete(id);
        if (!deletedSymptom) {
            return res.status(404).json({ message: 'Symptom not found' });
        }
        res.json({ message: 'Symptom deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting symptom', error: err });
    }
};
