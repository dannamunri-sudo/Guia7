const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');

exports.estadisticas = async (req, res, next) => {
  try {
    const [totalUsuarios, resumen, porCategoria] = await Promise.all([
      Usuario.countDocuments(),
      Producto.aggregate([
        { $group: {
            _id: null,
            totalProductos: { $sum: 1 },
            stockTotal: { $sum: '$stock' },
            precioPromedio: { $avg: '$precio' },
            valorInventario: { $sum: { $multiply: ['$precio', '$stock'] } }
        } }
      ]),
      Producto.aggregate([
        { $group: { _id: '$categoria', cantidad: { $sum: 1 }, stock: { $sum: '$stock' }, precioPromedio: { $avg: '$precio' } } },
        { $sort: { cantidad: -1 } },
        { $project: { _id: 0, categoria: '$_id', cantidad: 1, stock: 1, precioPromedio: { $round: ['$precioPromedio', 2] } } }
      ])
    ]);

    const r = resumen[0] || { totalProductos: 0, stockTotal: 0, precioPromedio: 0, valorInventario: 0 };
    res.json({
      totalUsuarios,
      totalProductos: r.totalProductos,
      stockTotal: r.stockTotal,
      precioPromedio: Math.round(r.precioPromedio * 100) / 100,
      valorInventario: r.valorInventario,
      porCategoria
    });
  } catch (error) { next(error); }
};
