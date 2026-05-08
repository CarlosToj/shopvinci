const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Validar formato de correo
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Encriptar contraseña
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Generar JWT
const generarJWT = (usuario) => {
  return jwt.sign(
    { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    if (!validateEmail(correo)) {
      return res.status(400).json({ error: 'Formato de correo inválido.' });
    }

    const existente = await Usuario.findOne({ where: { correo } });
    if (existente) {
      return res.status(409).json({ error: 'El correo ya está en uso.' });
    }

    const contrasenaHash = await hashPassword(contrasena);
    const rolValido = ['comprador', 'comerciante'].includes(rol) ? rol : 'comprador';

    const usuario = await Usuario.create({
      nombre,
      correo,
      contrasena: contrasenaHash,
      rol: rolValido,
    });

    const token = generarJWT(usuario);

    res.status(201).json({
      mensaje: 'Cuenta creada exitosamente.',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
    }

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = generarJWT(usuario);

    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { register, login, validateEmail, hashPassword, generarJWT };
