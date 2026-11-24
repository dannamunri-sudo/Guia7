const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');


exports.registrarUsuario = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(409).json({ mensaje: 'El email ya está registrado' });

    const hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ nombre, email, password: hash });
    res.status(201).json({ _id: usuario._id, nombre: usuario.nombre, email: usuario.email });
  } catch (error) { next(error); }
};


exports.loginUsuario = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });

    const usuario = await Usuario.findOne({ email }).select('+password');
    const ok = usuario && (await bcrypt.compare(password, usuario.password));
    if (!ok) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET || 'dev_secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h'
    });
    res.json({ mensaje: 'Login exitoso', token, usuario: { _id: usuario._id, nombre: usuario.nombre, email: usuario.email } });
  } catch (error) { next(error); }
};


exports.listarUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find(); 
    res.json({ total: usuarios.length, usuarios });
  } catch (error) { next(error); }
};
