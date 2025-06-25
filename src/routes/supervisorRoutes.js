const SupervisorController = require('../controllers/supervisorController');
const db = require('../db.js');
const autenticarSessao = require('../middleware/autenticarSessao')(db, 60);

const setSupervisorRoutes = (app) => {
    const supervisorController = new SupervisorController(db);

    app.get('/supervisor', (req, res) => { //rota mostrar todos
        supervisorController.getAllSupervisors(req, res);
    });

    app.post('/supervisor', (req, res) => { //rota inserir
        supervisorController.createSupervisor(req, res);
    });

    app.put('/supervisor/:id', autenticarSessao, (req, res) => { //rota atualizar (protegida)
        supervisorController.updateSupervisor(req, res);
    });

    app.delete('/supervisor/:id', autenticarSessao, (req, res) => { //rota deletar (protegida)
        supervisorController.deleteSupervisor(req, res);
    });

};

module.exports = setSupervisorRoutes;