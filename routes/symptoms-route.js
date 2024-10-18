const express = require('express');
const router = express.Router();
const symptomController = require('../controllers/symptoms-controller');

// CRUD routes for symptoms
router.get('/', symptomController.getAllSymptoms);
router.get('/:id/doctors', symptomController.getDoctors);
router.post('/', symptomController.createSymptom);
router.put('/:id', symptomController.updateSymptom);
router.delete('/:id', symptomController.deleteSymptom);

module.exports = router;
