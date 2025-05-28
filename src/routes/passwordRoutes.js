const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const db = require('../db.js');

const loginController = new loginController(db);

router.post('/login/supervisor', (req, res) => loginController.loginSupervisor(req, res));
router.post('/login/atendente', (req, res) => loginController.loginAtendente(req, res));

module.exports = router;
