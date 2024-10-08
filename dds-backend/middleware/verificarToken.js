const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Acceso denegado' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Acceso denegado' });

  jwt.verify(token, 'secreto', (err, user) => {
    if (err) return res.status(403).json({ message: 'token no es válido' });
    req.user = user; // Guarda el usuario decodificado en la solicitud

    // Verificar si el usuario es administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'usuario no autorizado!' });
    }

    next(); // Continúa si es válido y es admin
  });
}

module.exports = verificarToken;