// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET = 'sua_chave_secreta'; // IMPORTANTE: Use EXATAMENTE a mesma chave secreta definida em auth.controller.js

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ ok: false, message: 'Nenhum token fornecido.' });
  }

  // O cabeçalho de autorização geralmente vem no formato "Bearer TOKEN_AQUI"
  // Precisamos separar a palavra "Bearer" do token.
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ ok: false, message: 'Erro no formato do token.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ ok: false, message: 'Token mal formatado. Deve ser "Bearer [token]".' });
  }

  // Verifica se o token é válido
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      console.error('Erro na verificação do JWT:', err.message);
      // Detalha o erro do token para facilitar a depuração
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ ok: false, message: 'Token expirado.' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ ok: false, message: 'Token inválido.' });
      }
      return res.status(401).json({ ok: false, message: 'Falha na autenticação do token.' });
    }

    // Se o token for válido, o payload decodificado (que contém id e role)
    // é anexado ao objeto req para que as rotas subsequentes possam usá-lo.
    req.userId = decoded.id;
    req.userRole = decoded.role; // Você também pode precisar da role

    return next(); // Chama o próximo middleware ou a função da rota
  });
};