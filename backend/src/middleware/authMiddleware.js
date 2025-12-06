const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Pega o token do cabeçalho (Formato: "Bearer TOKEN")
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // 2. Separa o "Bearer" do token
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no Token' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatado' });
  }

  // 3. Verifica se o token é válido
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });

    // 4. Salva o ID do usuário na requisição para as próximas rotas usarem
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    return next();
  });
};