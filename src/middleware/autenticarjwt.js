const jwtUtil = require('../utils/jwt');

module.exports = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.headers['x-session-token'];
    if (!token) {
        return res.status(401).json({ erro: 'Token não informado' });
    }

    const payload = jwtUtil.verificarToken(token);
    if (!payload) {
        return res.status(401).json({ erro: 'Token inválido ou expirado' });
    }

    req.usuario_id = payload.usuario_id;
    req.tipo_usuario = payload.tipo_usuario;
    next();
};