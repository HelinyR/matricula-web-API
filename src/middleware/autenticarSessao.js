module.exports = (db, tempoExpiracaoMinutos = 60) => (req, res, next) => {
    const token = req.headers['x-session-token']; // talvez troque para o JWT
    if (!token) return res.status(401).json({ erro: 'Sessão não informada' });

    const query = `SELECT * FROM Sessoes WHERE sessao_id = ?`;
    db.query(query, [token], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ erro: 'Sessão inválida' });

        const sessao = results[0];
        const agora = new Date();
        const atualizadoEm = new Date(sessao.atualizado_em);
        const minutos = (agora - atualizadoEm) / 1000 / 60;

        if (minutos > tempoExpiracaoMinutos) {
            db.query('DELETE FROM Sessoes WHERE sessao_id = ?', [token]);
            return res.status(401).json({ erro: 'Sessão expirada por inatividade' });
        }

        //renova a sessão
        db.query('UPDATE Sessoes SET atualizado_em = NOW() WHERE sessao_id = ?', [token]);
        req.usuario_id = sessao.usuario_id;
        req.tipo_usuario = sessao.tipo_usuario;
        next();
    });
};