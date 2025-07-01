const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/loginController.js');
const db = require('../db.js');

const loginController = new LoginController(db);

router.post('/login/supervisor', (req, res) => loginController.loginSupervisor(req, res));
router.post('/login/atendente', (req, res) => loginController.loginAtendente(req, res));

module.exports = router;