const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};

const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso exclusivo para administradores.' });
  }
  next();
};

const soloComerciante = (req, res, next) => {
  if (req.usuario.rol !== 'comerciante' && req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso exclusivo para comerciantes.' });
  }
  next();
};

module.exports = { verificarToken, soloAdmin, soloComerciante };
