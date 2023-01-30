const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller');
const videoFileController = require('./videoFile.controller.js');
const { fail, success } = require('./../helper');
router.route('/uploadTempImage').post( ordersController.uploadTempImage);
router.route('/uploadExerciseVideo').post( videoFileController.uploadExerciseVideo);
 
module.exports = router; 
