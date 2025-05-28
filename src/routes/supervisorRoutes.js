const SupervisorController = require('../controllers/supervisorController');
const db = require('../db.js');

const setSupervisorRoutes = (app) => {
    const supervisorController = new SupervisorController(db);

    app.get('/supervisor', (req, res) => {
        supervisorController.getAllSupervisors(req, res);
    });
};

module.exports = setSupervisorRoutes;