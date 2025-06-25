class SupervisorController {
    constructor(db) {
        this.db = db;
    }

    getAllSupervisors(req, res) { //mostrar supervisores
        const query = `
            SELECT * FROM Supervisores
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

    //updateSupervisor(req,res){//atualiza supervisores}

}

module.exports = SupervisorController;