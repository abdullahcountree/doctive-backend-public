const exporess = require('express')
const authRouter = exporess.Router();
const authController = require('../controllers/auth-controller')

authRouter.post('/register' , authController.registerUser);
authRouter.post('/login' , authController.loginUser);
authRouter.post('/verify-otp' , authController.verifyOpt);

module.exports = authRouter