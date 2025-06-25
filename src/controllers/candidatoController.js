class CandidatoController {
    constructor(db) {
        this.db = db;
    }

    getAllCandidatos(req, res) {
        const query = `
            SELECT 
                nome,
                cpf,
                data_nascimento,
                telefone,
                endereco,
                rg,
                email 
            FROM Candidatos 
            WHERE ativo = 1
        `;

        this.db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao buscar candidatos' });
            }
            res.json(results);
        });
    }

    createCandidato(req, res) {
        const {
            nome,
            cpf,
            data_nascimento,
            telefone,
            endereco,
            rg,
            email,
            senha,
            matricula,
            curso,
            unidade,
            turno
        } = req.body;

        if (!nome || !cpf || !data_nascimento || !telefone || !endereco || !rg || !email || !matricula || !curso || !unidade || !turno) {
            return res.status(400).json({ error: 'Todos os campos obrigatórios: nome, cpf, data de nascimento, telefone, endereço, rg, email, matrícula, curso, unidade, turno' });
        }

        //checa duplicidade de email cpf rg ou matrícula
        const checkQuery = `
        SELECT * FROM Candidatos
        WHERE email = ? OR cpf = ? OR rg = ? OR matricula = ?
    `;
        this.db.query(checkQuery, [email, cpf, rg, matricula], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao verificar duplicidade' });
            }
            if (results.length > 0) {
                return res.status(409).json({ error: 'E-mail, CPF, RG ou matrícula já cadastrado' });
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

            const insertCandidatoQuery = `
            INSERT INTO Candidatos (nome, cpf, data_nascimento, telefone, endereco, rg, email, senha, matricula, curso, unidade, turno)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

            this.db.query(
                insertCandidatoQuery,
                [nome, cpf, data_nascimento, telefone, endereco, rg, email, senha || null, matricula, curso, unidade, turno],
                (err, result) => {
                    if (err) {
                        console.error('Erro ao inserir candidato:', err);
                        return res.status(500).json({ error: 'Erro ao inserir candidato' });
                    }
                    res.status(201).json({ mensagem: 'Candidato criado com sucesso', candidato_id: result.insertId });
                }
            );
        });
    }

    updateCandidato(req, res) {
        const { id } = req.params;
        const campos = [
            'nome',
            'data_nascimento',
            'telefone',
            'endereco',
            'email',
            'curso',
            'unidade',
            'turno'
        ];

        // filtra campos enviados
        const camposParaAtualizar = campos.filter(campo => req.body[campo] !== undefined);

        if (camposParaAtualizar.length === 0) {
            return res.status(400).json({ error: 'Nenhum campo para atualizar' });
        }

        const setClause = camposParaAtualizar.map(campo => `${campo} = ?`).join(', ');
        const values = camposParaAtualizar.map(campo => req.body[campo]);
        values.push(id);

        const query = `UPDATE Candidatos SET ${setClause} WHERE candidato_id = ?`;

        this.db.query(query, values, (err, result) => {
            if (err) {
                console.error('Erro ao atualizar candidato:', err);
                return res.status(500).json({ error: 'Erro ao atualizar candidato' });
            }
            res.json({ mensagem: 'Candidato atualizado com sucesso' });
        });
    }

    deleteCandidato(req, res) {
        const { id } = req.params;

        const query = `UPDATE Candidatos SET ativo = 0 WHERE candidato_id = ?`;

        this.db.query(query, [id], (err, result) => {
            if (err) {
                console.error('Erro ao deletar candidato:', err);
                return res.status(500).json({ error: 'Erro ao deletar candidato' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Candidato não encontrado' });
            }
            res.json({ mensagem: 'Candidato deletado com sucesso' });
        });
    }
}

module.exports = CandidatoController;