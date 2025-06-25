class AtendenteController {
    constructor(db) {
        this.db = db;
    }

    getAllAtendentes(req, res) {
        const query = `
            SELECT 
                nome,
                cpf,
                data_nascimento,
                telefone,
                endereco,
                rg,
                email 
            FROM Atendentes 
            WHERE ativo = 1
        `;

        this.db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao buscar atendentes' });
            }
            res.json(results);
        });
    }

    createAtendente(req, res) {
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

        //validação de força de senha
        if (senha) {
            const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            if (!senhaForte.test(senha)) {
                return res.status(400).json({
                    error: 'A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e símbolo.'
                });
            }
        }

        const insertAtendenteQuery = `
            INSERT INTO Atendentes (nome, cpf, data_nascimento, telefone, endereco, rg, email, senha)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        this.db.query(
            insertAtendenteQuery,
            [nome, cpf, data_nascimento, telefone, endereco, rg, email, senha],
            (err, result) => {
                if (err) {
                    console.error('Erro ao inserir atendente:', err);
                    return res.status(500).json({ error: 'Erro ao inserir atendente' });
                }
                res.status(201).json({ mensagem: 'Atendente criado com sucesso', atendente_id: result.insertId });
            }
        );
    }

    updateAtendente(req, res) {
        const { id } = req.params;
        const campos = [
            'nome',
            'data_nascimento',
            'telefone',
            'endereco',
            'email'
        ];

        // filtra campos enviados
        const camposParaAtualizar = campos.filter(campo => req.body[campo] !== undefined);

        if (camposParaAtualizar.length === 0) {
            return res.status(400).json({ error: 'Nenhum campo enviado para atualização.' });
        }

        const setClause = camposParaAtualizar.map(campo => `${campo} = ?`).join(', ');
        const values = camposParaAtualizar.map(campo => req.body[campo]);
        values.push(id);

        const updateQuery = `
        UPDATE Atendentes 
        SET ${setClause} 
        WHERE atendente_id = ?
    `;

        this.db.query(updateQuery, values, (err, result) => {
            if (err) {
                console.error('Erro ao atualizar atendente:', err);
                return res.status(500).json({ error: 'Erro ao atualizar atendente' });
            }
            res.json({ mensagem: 'Atendente atualizado com sucesso' });
        });
    }

    deleteAtendente(req, res) {
        const { id } = req.params;

        const deleteQuery = `
            UPDATE Atendentes 
            SET ativo = 0 
            WHERE atendente_id = ?
        `;

        this.db.query(deleteQuery, [id], (err, result) => {
            if (err) {
                console.error('Erro ao deletar atendente:', err);
                return res.status(500).json({ error: 'Erro ao deletar atendente' });
            }
            res.json({ mensagem: 'Atendente deletado com sucesso' });
        });
    }
}

module.exports = AtendenteController;