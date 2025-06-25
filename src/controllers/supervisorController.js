class SupervisorController {
    constructor(db) {
        this.db = db;
    }

    getAllSupervisors(req, res) { //mostrar supervisores
        const query = `
            SELECT    
            nome,
            cpf,
            data_nascimento,
            telefone,
            endereco,
            rg,
            email 
            FROM Supervisores 
            WHERE ativo = 1
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
            rg,
            email,
            senha
        } = req.body;

        if (!nome || !cpf || !data_nascimento || !telefone || !endereco || !rg || !email || !senha) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios: nome, cpf, data de nascimento, telefone, endereço, rg, email, senha' });
        }

        const insertSupervisorQuery = `
        INSERT INTO Supervisores (nome, cpf, data_nascimento, telefone, endereco, rg, email, senha)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

        this.db.query(
            insertSupervisorQuery,
            [nome, cpf, data_nascimento, telefone, endereco, rg, email, senha],
            (err, result) => {
                if (err) {
                    console.error('Erro ao inserir supervisor:', err);
                    return res.status(500).json({ error: 'Erro ao inserir supervisor' });
                }
                res.status(201).json({ mensagem: 'Supervisor criado com sucesso', supervisor_id: result.insertId });
            }
        );
    }

    updateSupervisor(req, res) {
        const { id } = req.params;
        const campos = [
            'nome',
            'data_nascimento',
            'telefone',
            'endereco',
            'email'
        ];

        const camposParaAtualizar = campos.filter(campo => req.body[campo] !== undefined);

        if (camposParaAtualizar.length === 0) {
            return res.status(400).json({ error: 'Nenhum campo enviado para atualização.' });
        }

        const setClause = camposParaAtualizar.map(campo => `${campo} = ?`).join(', ');
        const values = camposParaAtualizar.map(campo => req.body[campo]);
        values.push(id);

        const updateSupervisorQuery = `
        UPDATE Supervisores
        SET ${setClause}
        WHERE supervisor_id = ?
    `;

        this.db.query(
            updateSupervisorQuery,
            values,
            (err) => {
                if (err) {
                    console.error('Erro ao atualizar supervisor:', err);
                    return res.status(500).json({ error: 'Erro ao atualizar supervisor' });
                }
                res.json({ mensagem: 'Supervisor atualizado com sucesso' });
            }
        );
    }

    deleteSupervisor(req, res) {
        const { id } = req.params;

        const deleteSupervisorQuery = `
            UPDATE Supervisores
            SET ativo = 0
            WHERE supervisor_id = ?
        `;

        this.db.query(deleteSupervisorQuery, [id], (err) => {
            if (err) {
                console.error('Erro ao deletar supervisor:', err);
                return res.status(500).json({ error: 'Erro ao deletar supervisor' });
            }
            res.json({ mensagem: 'Supervisor deletado com sucesso' });
        });
    }
}

module.exports = SupervisorController;