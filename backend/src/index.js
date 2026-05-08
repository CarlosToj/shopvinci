const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const ordenesRoutes = require('./routes/ordenes');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productosRoutes);
app.use('/api/orders', ordenesRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'ShopVinci API funcionando correctamente ✓' });
});

// Conectar DB e iniciar servidor
const PORT = process.env.PORT || 5000;
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a MySQL establecida ✓');
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch(err => console.error('Error de conexión a la base de datos:', err));

module.exports = app;
