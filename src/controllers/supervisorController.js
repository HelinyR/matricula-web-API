const { validarCPF, validarRG, validarEmail } = require('../utils/validacao');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

        //verifica formato
        if (!validarCPF(cpf)) {
            return res.status(400).json({ error: 'CPF inválido' });
        }
        if (!validarRG(rg)) {
            return res.status(400).json({ error: 'RG inválido. Deve conter 7 dígitos numéricos.' });
        }
        if (!validarEmail(email)) {
            return res.status(400).json({ error: 'Email inválido.' });

        }
        //checa duplicidade de email cpf ou rg
        const checkQuery = `
            SELECT * FROM Supervisores
            WHERE email = ? OR cpf = ? OR rg = ?
        `;
        this.db.query(checkQuery, [email, cpf, rg], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao verificar duplicidade' });
            }
            if (results.length > 0) {
                return res.status(409).json({ error: 'E-mail, CPF ou RG já cadastrado' });
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

            bcrypt.hash(senha, saltRounds, (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: 'Erro ao criptografar senha' });
                }
                //salva o hash
                const insertQuery = `
                    INSERT INTO Supervisores (nome, cpf, data_nascimento, telefone, endereco, rg, email, senha)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;

                this.db.query(
                    insertQuery,
                    [nome, cpf, data_nascimento, telefone, endereco, rg, email, hash],
                    (err, result) => {
                        if (err) {
                            console.error('Erro ao inserir supervisor:', err);
                            return res.status(500).json({ error: 'Erro ao inserir supervisor' });
                        }
                        res.status(201).json({ mensagem: 'Supervisor criado com sucesso', supervisor_id: result.insertId });
                    }
                );
            });
        });
    }

    updateSupervisor(req, res) {
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

        // Busca a senha atual no banco
        const getSenhaQuery = `SELECT senha FROM Supervisores WHERE supervisor_id = ?`;
        this.db.query(getSenhaQuery, [id], (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ error: 'Supervisor não encontrado.' });
            }

            // Compara a senha informada com o hash salvo
            bcrypt.compare(senha_atual, results[0].senha, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({ error: 'Senha atual incorreta.' });
                }

                // Prossegue com a atualização
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
            });
        });
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