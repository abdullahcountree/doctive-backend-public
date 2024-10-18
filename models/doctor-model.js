// doctorModel.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    experience: { type: Number, required: true },
    contact: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true },
    image: { type: String }, // Store image path
    symptoms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Symptom' }],
});

// Optional method to get symptoms related to this doctor
doctorSchema.methods.getSymptoms = function () {
    return Symptom.find({ doctorId: this._id });
};


const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
