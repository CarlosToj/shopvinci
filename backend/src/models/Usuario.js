const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  correo: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  contrasena: { type: DataTypes.STRING(255), allowNull: false },
  rol: { type: DataTypes.ENUM('comprador', 'comerciante', 'admin'), defaultValue: 'comprador' },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'usuarios', timestamps: false });

module.exports = Usuario;
