const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'undefined'; // Use variável de ambiente em produção
const EXPIRES_IN = '60m'; // 60 minutos

function gerarToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

function verificarToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (err) {
        return null;
    }
}

module.exports = {
    gerarToken,
    verificarToken
};