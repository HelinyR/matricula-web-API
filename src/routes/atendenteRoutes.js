const AtendenteController = require('../controllers/atendenteController');
const db = require('../db.js');
const autenticarJWT = require('../middleware/autenticarjwt');

const setAtendenteRoutes = (app) => {
    const atendenteController = new AtendenteController(db);

    app.get('/atendente', autenticarJWT, (req, res) => { // Rota para mostrar todos os atendentes
        atendenteController.getAllAtendentes(req, res);
    });
    app.get('/atendente',autenticarJWT, (req, res) => { // Rota para mostar atendente individual
        atendenteController.getAtendente(req, res);
    });

    app.post('/atendente', autenticarJWT, (req, res) => { // Rota para inserir um atendente
        atendenteController.createAtendente(req, res);
    });

    app.put('/atendente/:id', autenticarJWT, (req, res) => { // Rota para atualizar um atendente (protegida)
        atendenteController.updateAtendente(req, res);
    });

    app.delete('/atendente/:id', autenticarJWT, (req, res) => { // Rota para deletar um atendente (protegida)
        atendenteController.deleteAtendente(req, res);
    });

};

module.exports = setAtendenteRoutes;