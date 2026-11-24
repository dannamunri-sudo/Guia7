const router = require('express').Router();
const c = require('../controllers/reporteController');

router.get('/estadisticas', c.estadisticas); 

module.exports = router;
