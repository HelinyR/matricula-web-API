class SupervisorController {
    constructor(db) {
        this.db = db;
    }

    getAllSupervisors(req, res) {
        const query = `
            SELECT 
                u.id as usuario_id,
                u.nome,
                u.cpf,
                u.data_nascimento,
                u.telefone,
                u.endereco,
                u.cargo,
                u.rg,
                s.email,
                s.senha
            FROM usuario u
            JOIN supervisor s ON u.id = s.usuario_id
        `;

        this.db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao buscar supervisores' });
            }
            res.json(results);
        });
    }


    createSupervisor(req, res) {
        const {
            nome,
            cpf,
            data_nascimento,
            telefone,
            endereco,
            cargo,
            rg,
            email,
            senha
        } = req.body;

        if (!nome || !cpf || !data_nascimento || !telefone || !endereco || !cargo || !rg || !email || !senha) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios: nome, cpf, data de nascimento, telefone, endereço, cargo, rg, email, senha' });
        }

        const insertUsuarioQuery = `
            INSERT INTO usuario (nome, cpf, data_nascimento, telefone, endereco, cargo, rg)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        this.db.query(insertUsuarioQuery, [nome, cpf, data_nascimento, telefone, endereco, cargo, rg], (err, result) => {
            if (err) {
                console.error('Erro ao inserir usuário:', err);
                return res.status(500).json({ error: 'Erro ao inserir usuário' });
            }

            const usuarioId = result.insertId;

            const insertSupervisorQuery = `
                INSERT INTO supervisor (usuario_id, email, senha)
                VALUES (?, ?, ?)
            `;

            this.db.query(insertSupervisorQuery, [usuarioId, email, senha], (err2, result2) => {
                if (err2) {
                    console.error('Erro ao inserir supervisor:', err2);
                    return res.status(500).json({ error: 'Erro ao inserir supervisor' });
                }

                res.status(201).json({ mensagem: 'Supervisor criado com sucesso', usuario_id: usuarioId });
            });
        });
    }

}

module.exports = SupervisorController;