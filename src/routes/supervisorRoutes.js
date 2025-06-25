const SupervisorController = require('../controllers/supervisorController');
const db = require('../db.js');

const setSupervisorRoutes = (app) => {
    const supervisorController = new SupervisorController(db);

    app.get('/supervisor', (req, res) => { //rota mostrar todos
        supervisorController.getAllSupervisors(req, res);
    });

    app.post('/supervisor', (req, res) => { //rota inserir
        supervisorController.createSupervisor(req, res);
    });

    app.put('/supervisor/:id', (req, res) => { //rota atualizar
        supervisorController.updateSupervisor(req, res);
    });

    app.delete('/supervisor/:id', (req, res) => { //rota deletar
        supervisorController.deleteSupervisor(req, res);
    });

};

module.exports = setSupervisorRoutes;