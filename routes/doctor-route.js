const exporess = require('express')
const doctorRouter = exporess.Router();
const doctorController = require('../controllers/doctor-controller')

doctorRouter.get('/all' , doctorController.getAllDoctors);
doctorRouter.get('/high-rating', doctorController.getHigherRatingDoctor);
doctorRouter.get('/highest-rated', doctorController.getHighestRatedDoctor);
doctorRouter.get('/:id', doctorController.getSymptomWithDoctors);

module.exports = doctorRouter