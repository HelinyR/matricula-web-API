const SupervisorController = require('../controllers/supervisorController');
const db = require('../db.js');
const autenticarJWT = require('../middleware/autenticarjwt');

const setSupervisorRoutes = (app) => {
    const supervisorController = new SupervisorController(db);

    app.get('/supervisor', autenticarJWT, (req, res) => { //rota mostrar todos
        supervisorController.getAllSupervisors(req, res);
    });

    app.post('/supervisor', autenticarJWT, (req, res) => { //rota inserir
        supervisorController.createSupervisor(req, res);
    });

    app.put('/supervisor/:id', autenticarJWT, (req, res) => { //rota atualizar (protegida)
        supervisorController.updateSupervisor(req, res);
    });

    app.delete('/supervisor/:id', autenticarJWT, (req, res) => { //rota deletar (protegida)
        supervisorController.deleteSupervisor(req, res);
    });

};

module.exports = setSupervisorRoutes;