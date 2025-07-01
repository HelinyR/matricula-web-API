const AtendenteController = require('../controllers/atendenteController');
const db = require('../db.js');

const setAtendenteRoutes = (app) => {
    const atendenteController = new AtendenteController(db);

    app.get('/atendente', (req, res) => { // Rota para mostrar todos os atendentes
        atendenteController.getAllAtendentes(req, res);
    });

    app.post('/atendente', (req, res) => { // Rota para inserir um atendente
        atendenteController.createAtendente(req, res);
    });

    app.put('/atendente/:id', (req, res) => { // Rota para atualizar um atendente (protegida)
        atendenteController.updateAtendente(req, res);
    });

    app.delete('/atendente/:id', (req, res) => { // Rota para deletar um atendente (protegida)
        atendenteController.deleteAtendente(req, res);
    });

};

module.exports = setAtendenteRoutes;