const CandidatoController = require('../controllers/candidatoController');
const db = require('../db.js');

const setCandidatoRoutes = (app) => {
    const candidatoController = new CandidatoController(db);

    app.get('/candidato', (req, res) => { // Rota para mostrar todos os candidatos
        candidatoController.getAllCandidatos(req, res);
    });

    app.post('/candidato', (req, res) => { // Rota para inserir um candidato
        candidatoController.createCandidato(req, res);
    });

    app.put('/candidato/:id', (req, res) => { // Rota para atualizar um candidato
        candidatoController.updateCandidato(req, res);
    });

    app.delete('/candidato/:id', (req, res) => { // Rota para deletar um candidato
        candidatoController.deleteCandidato(req, res);
    });
}

module.exports = setCandidatoRoutes;
