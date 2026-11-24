
exports.noEncontrado = (req, res) => {
  res.status(404).json({ mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};


exports.manejarErrores = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errores = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ mensaje: 'Error de validación', errores });
  }
  if (err.code === 11000) {
    return res.status(409).json({ mensaje: 'Registro duplicado', campo: Object.keys(err.keyValue || {}) });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'JSON mal formado' });
  }
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
};
