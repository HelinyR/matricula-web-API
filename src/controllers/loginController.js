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
            if (supervisor.senha !== senha) {  // no seu futuro, aqui vai bcrypt para hash
                return res.status(401).json({ erro: 'Senha incorreta' });
            }

            // Sucesso no login
            res.json({ mensagem: 'Login de supervisor realizado com sucesso', supervisorId: supervisor.usuario_id });
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
            if (atendente.senha !== senha) {
                return res.status(401).json({ erro: 'Senha incorreta' });
            }

            // Sucesso no login
            res.json({ mensagem: 'Login de atendente realizado com sucesso', atendenteId: atendente.usuario_id });
        });
    }
}

module.exports = loginController;