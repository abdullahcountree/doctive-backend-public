const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');

// POST route for collecting user data
router.post('/get-data-before-call', userController.GetDataBeforeCall);

module.exports = router;
