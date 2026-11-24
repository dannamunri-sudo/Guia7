require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarBD = require('./config/db');
const { noEncontrado, manejarErrores } = require('./middlewares/errorHandler');

const app = express();

// 1. Conectar a Base de Datos
conectarBD();

// 2. Middlewares globales
app.use(cors());
app.use(express.json());

// 3. Rutas de la API
app.get('/', (req, res) => res.json({ mensaje: 'API Guía 7 - Express + MongoDB funcionando' }));
app.use('/api/productos', require('./routes/productoRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/reportes', require('./routes/reporteRoutes'));

// 4. Manejo de errores
app.use(noEncontrado);
app.use(manejarErrores);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
