const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email no válido']
  },
  password: { type: String, required: [true, 'La contraseña es obligatoria'], select: false },
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
