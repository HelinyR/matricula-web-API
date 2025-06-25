const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController.js');
const db = require('../db.js');

router.post('/login/supervisor', (req, res) => loginController.loginSupervisor(req, res));
router.post('/login/atendente', (req, res) => loginController.loginAtendente(req, res));

module.exports = router;
