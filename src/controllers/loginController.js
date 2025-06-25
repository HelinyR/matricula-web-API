const bcrypt = require('bcrypt');
const crypto = require('crypto');

class loginController {
    constructor(db) {
        this.db = db;
    }

    loginSupervisor(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
        }

        const query = 'SELECT * FROM supervisor WHERE email = ?';
        this.db.query(query, [email], (err, results) => {
            if (err) return res.status(500).json({ erro: 'Erro no banco de dados' });
            if (results.length === 0) return res.status(401).json({ erro: 'Supervisor não encontrado' });

            const supervisor = results[0];
            bcrypt.compare(senha, supervisor.senha, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({ erro: 'Senha incorreta' });
                }
                //gera token
                const sessao_id = crypto.randomBytes(32).toString('hex');
                const tipo_usuario = 'supervisor';

                const insertSessao = `
                    INSERT INTO Sessoes (sessao_id, usuario_id, tipo_usuario)
                    VALUES (?, ?, ?)
                `;
                this.db.query(insertSessao, [sessao_id, supervisor.usuario_id, tipo_usuario], (err) => {
                    if (err) return res.status(500).json({ erro: 'Erro ao criar sessão' });
                    res.json({
                        mensagem: 'Login de supervisor realizado com sucesso',
                        supervisorId: supervisor.usuario_id,
                        sessaoToken: sessao_id
                    });
                });
            });
        });
    }

    loginAtendente(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
        }

        const query = 'SELECT * FROM atendente WHERE email = ?';
        this.db.query(query, [email], (err, results) => {
            if (err) return res.status(500).json({ erro: 'Erro no banco de dados' });
            if (results.length === 0) return res.status(401).json({ erro: 'Atendente não encontrado' });

            const atendente = results[0];
            bcrypt.compare(senha, atendente.senha, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({ erro: 'Senha incorreta' });
                }
                // Sucesso no login
                const sessao_id = crypto.randomBytes(32).toString('hex');
                const tipo_usuario = 'atendente';

                const insertSessao = `
                    INSERT INTO Sessoes (sessao_id, usuario_id, tipo_usuario)
                    VALUES (?, ?, ?)
                `;
                this.db.query(insertSessao, [sessao_id, atendente.usuario_id, tipo_usuario], (err) => {
                    if (err) return res.status(500).json({ erro: 'Erro ao criar sessão' });
                    res.json({
                        mensagem: 'Login de atendente realizado com sucesso',
                        atendenteId: atendente.usuario_id,
                        sessaoToken: sessao_id
                    });
                });
            });
        });
    }
}

module.exports = loginController;