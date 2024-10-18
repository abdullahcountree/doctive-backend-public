const mongoose = require('mongoose');


const symptomSchema = new mongoose.Schema({
    symptom: { type: String, required: true },
});

const Symptom = mongoose.model('Symptom', symptomSchema);
module.exports = Symptom;
