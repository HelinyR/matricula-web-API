const bcrypt = require('bcrypt');
const jwtUtil = require('../utils/jwt');

const LIMITE_TENTATIVAS = 5;
const BLOQUEIO_MINUTAS = 15;

class loginController {
    constructor(db) {
        this.db = db;
    }

    loginSupervisor(req, res) {
        const { email, senha } = req.body;
        const ip = req.ip || req.connection.remoteAddress;
        const cargo = 'supervisor';

        //Verifica tentativas
        const selectTentativas = 'SELECT id, tentativas, ultimo_erro FROM TentativasLogin WHERE email = ? AND ip = ? AND cargo = ? ORDER BY ultimo_erro DESC LIMIT 1';
        this.db.query(selectTentativas, [email, ip, cargo], (err, tentativasResults) => {
            if (err) {
                console.error('Erro ao verificar tentativas (supervisor):', err);
                return res.status(500).json({ erro: 'Erro ao verificar tentativas' });
            }

            let bloqueado = false;
            let podeInserirNovo = false;
            let tentativasAtual = 0;
            if (tentativasResults.length > 0) {
                const { tentativas, ultimo_erro } = tentativasResults[0];
                const agoraUTC = new Date(Date.now());
                const ultimoUTC = ultimo_erro ? new Date(ultimo_erro + 'Z') : null;
                const minutos = ultimoUTC ? (agoraUTC - ultimoUTC) / 1000 / 60 : 0;
                tentativasAtual = tentativas;
                if (tentativas >= LIMITE_TENTATIVAS) {
                    if (minutos < BLOQUEIO_MINUTAS) {
                        bloqueado = true;
                        return res.status(429).json({ erro: `Muitas tentativas. Tente novamente em ${Math.ceil(BLOQUEIO_MINUTAS - minutos)} minutos.` });
                    } else {
                        podeInserirNovo = true;
                    }
                }
            } else {
                podeInserirNovo = true;
            }

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
                        if (podeInserirNovo) {
                            // Novo ciclo de tentativas
                            const insert = `INSERT INTO TentativasLogin (email, ip, tentativas, ultimo_erro, cargo) VALUES (?, ?, 1, NOW(), ?)`;
                            this.db.query(insert, [email, ip, cargo]);
                        } else {
                            // Atualiza tentativas do registro mais recente
                            const update = `UPDATE TentativasLogin SET tentativas = tentativas + 1, ultimo_erro = NOW() WHERE id = ?`;
                            this.db.query(update, [tentativasResults[0].id]);
                        }
                        return res.status(401).json({ erro: 'Senha incorreta' });
                    }

                    // Se login for bem-sucedido:
                    const reset = 'DELETE FROM TentativasLogin WHERE email = ? AND ip = ? AND cargo = ?';
                    this.db.query(reset, [email, ip, cargo]);
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
        );
    }

    loginAtendente(req, res) {
        const { email, senha } = req.body;
        const ip = req.ip || req.connection.remoteAddress;
        const cargo = 'atendente'; 

        // Verifica tentativas
        const selectTentativas = 'SELECT id, tentativas, ultimo_erro FROM TentativasLogin WHERE email = ? AND ip = ? AND cargo = ? ORDER BY ultimo_erro DESC LIMIT 1';
        this.db.query(selectTentativas, [email, ip, cargo], (err, tentativasResults) => {
            if (err) {
                console.error('Erro ao verificar tentativas (atendente):', err);
                return res.status(500).json({ erro: 'Erro ao verificar tentativas' });
            }

            let bloqueado = false;
            let podeInserirNovo = false;
            let tentativasAtual = 0;
            if (tentativasResults.length > 0) {
                const { tentativas, ultimo_erro } = tentativasResults[0];
                const agoraUTC = new Date(Date.now());
                const ultimoUTC = ultimo_erro ? new Date(ultimo_erro + 'Z') : null;
                const minutos = ultimoUTC ? (agoraUTC - ultimoUTC) / 1000 / 60 : 0;
                tentativasAtual = tentativas;
                console.log(`[ATENDENTE] Tentativas atuais: ${tentativas}, Minutos desde última: ${minutos.toFixed(2)}`);
                if (tentativas >= LIMITE_TENTATIVAS) {
                    if (minutos < BLOQUEIO_MINUTAS) {
                        bloqueado = true;
                        console.log('[ATENDENTE] BLOQUEADO, aguardando tempo de bloqueio.');
                        return res.status(429).json({ erro: `Muitas tentativas. Tente novamente em ${Math.ceil(BLOQUEIO_MINUTAS - minutos)} minutos.` });
                    } else {
                        podeInserirNovo = true;
                        console.log('[ATENDENTE] Bloqueio expirou, pode inserir novo registro.');
                    }
                }
            } else {
                podeInserirNovo = true;
                console.log('[ATENDENTE] Nenhum registro anterior, pode inserir novo.');
            }

            if (!email || !senha) {
                console.log('[ATENDENTE] Email ou senha não informados.');
                return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
            }

            const query = 'SELECT * FROM Atendentes WHERE email = ?';
            this.db.query(query, [email], (err, results) => {
                if (err) {
                    console.log('[ATENDENTE] Erro no banco de dados ao buscar atendente:', err);
                    return res.status(500).json({ erro: 'Erro no banco de dados' });
                }
                if (results.length === 0) {
                    console.log('[ATENDENTE] Atendente não encontrado.');
                    return res.status(401).json({ erro: 'Atendente não encontrado' });
                }

                const atendente = results[0];
                bcrypt.compare(senha, atendente.senha, (err, result) => {
                    if (err || !result) {
                        if (podeInserirNovo) {
                            // Novo ciclo de tentativas
                            console.log('[ATENDENTE] Inserindo novo registro de tentativa.');
                            const insert = `INSERT INTO TentativasLogin (email, ip, tentativas, ultimo_erro, cargo) VALUES (?, ?, 1, NOW(), ?)`;
                            this.db.query(insert, [email, ip, cargo]);
                        } else {
                            // Atualiza tentativas do registro mais recente
                            console.log('[ATENDENTE] Atualizando registro de tentativa existente.');
                            const update = `UPDATE TentativasLogin SET tentativas = tentativas + 1, ultimo_erro = NOW() WHERE id = ?`;
                            this.db.query(update, [tentativasResults[0].id]);
                        }
                        return res.status(401).json({ erro: 'Senha incorreta' });
                    }

                    // Se login for bem-sucedido:
                    console.log('[ATENDENTE] Login bem-sucedido, limpando tentativas.');
                    const reset = 'DELETE FROM TentativasLogin WHERE email = ? AND ip = ? AND cargo = ?';
                    this.db.query(reset, [email, ip, cargo]);
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
        });
    }
}

module.exports = loginController;