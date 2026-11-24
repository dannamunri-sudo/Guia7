const mongoose = require('mongoose');
const Producto = require('../models/Producto');

const idValido = (id) => mongoose.isValidObjectId(id);


exports.crearProducto = async (req, res, next) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (error) { next(error); }
};


exports.listarProductos = async (req, res, next) => {
  try {
    const productos = await Producto.find().sort({ fechaCreacion: -1 });
    res.json({ total: productos.length, productos });
  } catch (error) { next(error); }
};


exports.obtenerProducto = async (req, res, next) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ mensaje: 'ID no válido' });
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) { next(error); }
};


exports.actualizarProducto = async (req, res, next) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ mensaje: 'ID no válido' });
    const producto = await Producto.findOneAndReplace(
      { _id: req.params.id },
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) { next(error); }
};


exports.eliminarProducto = async (req, res, next) => {
  try {
    if (!idValido(req.params.id)) return res.status(400).json({ mensaje: 'ID no válido' });
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente', producto });
  } catch (error) { next(error); }
};


exports.productosPorCategoria = async (req, res, next) => {
  try {
    const cat = req.params.cat;
    const escapada = cat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const productos = await Producto.find({ categoria: new RegExp(`^${escapada}$`, 'i') });
    res.json({ categoria: cat, total: productos.length, productos });
  } catch (error) { next(error); }
};
