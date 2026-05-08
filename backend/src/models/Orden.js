const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Orden = sequelize.define('Orden', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  comprador_id: { type: DataTypes.INTEGER, allowNull: false },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  estado: {
    type: DataTypes.ENUM('pendiente', 'en_proceso', 'enviado', 'entregado'),
    defaultValue: 'pendiente'
  },
  direccion_envio: { type: DataTypes.STRING(255) },
  metodo_pago: { type: DataTypes.STRING(50), defaultValue: 'simulado' },
}, { tableName: 'ordenes', createdAt: 'creado_en', updatedAt: false });

module.exports = Orden;
