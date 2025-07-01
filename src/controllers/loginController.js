const bcrypt = require('bcrypt');
const jwtUtil = require('../utils/jwt');

class loginController {
    constructor(db) {
        this.db = db;
    }

    loginSupervisor(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
        }

        const query = 'SELECT * FROM Supervisores WHERE email = ?';
        this.db.query(query, [email], (err, results) => {
            if (err) return res.status(500).json({ erro: 'Erro no banco de dados' });
            if (results.length === 0) return res.status(401).json({ erro: 'Supervisor não encontrado' });

            const supervisor = results[0];
            bcrypt.compare(senha, supervisor.senha, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({ erro: 'Senha incorreta' });
                }
                // Gera token JWT
                const payload = {
                    usuario_id: supervisor.supervisor_id,
                    tipo_usuario: 'supervisor'
                };
                const token = jwtUtil.gerarToken(payload);
                res.json({
                    mensagem: 'Login de supervisor realizado com sucesso',
                    supervisorId: supervisor.supervisor_id,
                    token
                });
            });
        });
    }

    loginAtendente(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
        }

        const query = 'SELECT * FROM Atendentes WHERE email = ?';
        this.db.query(query, [email], (err, results) => {
            if (err) return res.status(500).json({ erro: 'Erro no banco de dados' });
            if (results.length === 0) return res.status(401).json({ erro: 'Atendente não encontrado' });

            const atendente = results[0];
            bcrypt.compare(senha, atendente.senha, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({ erro: 'Senha incorreta' });
                }
                // Gera token JWT
                const payload = {
                    usuario_id: atendente.atendente_id,
                    tipo_usuario: 'atendente'
                };
                const token = jwtUtil.gerarToken(payload);
                res.json({
                    mensagem: 'Login de atendente realizado com sucesso',
                    atendenteId: atendente.atendente_id,
                    token
                });
            });
        });
    }
}

module.exports = loginController;