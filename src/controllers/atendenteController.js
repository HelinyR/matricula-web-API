const { validarCPF, validarRG, validarEmail } = require('../utils/validacao');
const bcrypt = require('bcrypt');
const saltRounds = 10;
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

        //verifica formato
        if (!validarCPF(cpf)) {
            return res.status(400).json({ error: 'CPF inválido.' });
        }
        if (!validarRG(rg)) {
            return res.status(400).json({ error: 'RG inválido. Deve conter 7 dígitos numéricos.' });
        }
        if (!validarEmail(email)) {
            return res.status(400).json({ error: 'E-mail inválido.' });
        }

        // Checa duplicidade de email, cpf ou rg
        const checkQuery = `
        SELECT * FROM Atendentes
        WHERE email = ? OR cpf = ? OR rg = ?
    `;
        this.db.query(checkQuery, [email, cpf, rg], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao verificar duplicidade' });
            }
            if (results.length > 0) {
                return res.status(409).json({ error: 'E-mail, CPF ou RG já cadastrado' });
            }

            // Validação de força de senha
            const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            if (!senhaForte.test(senha)) {
                return res.status(400).json({
                    error: 'A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e símbolo.'
                });
            }

            bcrypt.hash(senha, saltRounds, (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: 'Erro ao criptografar senha' });
                }

                const insertAtendenteQuery = `
            INSERT INTO Atendentes (nome, cpf, data_nascimento, telefone, endereco, rg, email, senha)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

                this.db.query(
                    insertAtendenteQuery,
                    [nome, cpf, data_nascimento, telefone, endereco, rg, email, hash],
                    (err, result) => {
                        if (err) {
                            console.error('Erro ao inserir atendente:', err);
                            return res.status(500).json({ error: 'Erro ao inserir atendente' });
                        }
                        res.status(201).json({ mensagem: 'Atendente criado com sucesso', atendente_id: result.insertId });
                    }
                );
            });
        });
    }

    updateAtendente(req, res) {
        const { id } = req.params;
        const { senha_atual } = req.body;
        const campos = [
            'nome',
            'data_nascimento',
            'telefone',
            'endereco',
            'email'
        ];

        if (!senha_atual) {
            return res.status(400).json({ error: 'A senha atual é obrigatória para atualizar os dados.' });
        }

        //senha atual
        const getSenhaQuery = `SELECT senha FROM Atendentes WHERE atendente_id = ?`;
        this.db.query(getSenhaQuery, [id], (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ error: 'Atendente não encontrado.' });
            }

            //compara com hash
            bcrypt.compare(senha_atual, results[0].senha, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({ error: 'Senha atual incorreta.' });
                }

                //atualiza
                const camposParaAtualizar = campos.filter(campo => req.body[campo] !== undefined);
                if (camposParaAtualizar.length === 0) {
                    return res.status(400).json({ error: 'Nenhum campo enviado para atualização.' });
                }

                const setClause = camposParaAtualizar.map(campo => `${campo} = ?`).join(', ');
                const values = camposParaAtualizar.map(campo => req.body[campo]);
                values.push(id);

                const updateAtendenteQuery = `
                UPDATE Atendentes
                SET ${setClause}
                WHERE atendente_id = ?
            `;

                this.db.query(
                    updateAtendenteQuery,
                    values,
                    (err) => {
                        if (err) {
                            console.error('Erro ao atualizar atendente:', err);
                            return res.status(500).json({ error: 'Erro ao atualizar atendente' });
                        }
                        res.json({ mensagem: 'Atendente atualizado com sucesso' });
                    }
                );
            });
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