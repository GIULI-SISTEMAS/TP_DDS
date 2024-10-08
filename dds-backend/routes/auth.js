const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Ruta de inicio de sesión
router.post('/login', (req, res) => {
  const { usuario, clave } = req.body;

  // Autenticación de usuario admin
  if (usuario === 'admin' && clave === '123') {
    const token = jwt.sign({ usuario: 'admin', role: 'admin' }, 'secreto', { expiresIn: '1h' });
    return res.json({ accessToken: token });
  } 
  // Autenticación de usuario miembro
  else if (usuario === 'juan' && clave === '123') {
    const token = jwt.sign({ usuario: 'juan', role: 'miembro' }, 'secreto', { expiresIn: '1h' });
    return res.json({ accessToken: token });
  } 
  // Si las credenciales son incorrectas
  else {
    return res.status(401).json({ message: 'usuario o clave incorrecta' });
  }
});

// Exportar el router para que pueda ser usado en index.js
module.exports = router;