const router = require('express').Router();
const c = require('../controllers/productoController');

router.post('/', c.crearProducto);                          
router.get('/', c.listarProductos);                         
router.get('/categoria/:cat', c.productosPorCategoria);    
router.get('/:id', c.obtenerProducto);                      
router.put('/:id', c.actualizarProducto);                   
router.delete('/:id', c.eliminarProducto);                  
module.exports = router;
