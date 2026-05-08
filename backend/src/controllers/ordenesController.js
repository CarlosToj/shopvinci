const Orden = require('../models/Orden');
const Producto = require('../models/Producto');
const sequelize = require('../config/database');

// POST /api/orders — crear orden
const createOrden = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, direccion_envio, metodo_pago } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío.' });
    }

    let total = 0;
    for (const item of items) {
      const producto = await Producto.findByPk(item.producto_id, { transaction: t });
      if (!producto || producto.stock < item.cantidad) {
        await t.rollback();
        return res.status(400).json({ error: `Stock insuficiente para: ${producto?.nombre || 'producto'}` });
      }
      total += producto.precio * item.cantidad;
      await producto.update({ stock: producto.stock - item.cantidad }, { transaction: t });
    }

    const orden = await Orden.create({
      comprador_id: req.usuario.id,
      total,
      direccion_envio,
      metodo_pago: metodo_pago || 'simulado',
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ mensaje: 'Orden creada exitosamente.', orderId: orden.id, estado: orden.estado, total });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Error al procesar la orden.' });
  }
};

// GET /api/orders/mis-pedidos — pedidos del comprador
const getMisPedidos = async (req, res) => {
  try {
    const ordenes = await Orden.findAll({
      where: { comprador_id: req.usuario.id },
      order: [['creado_en', 'DESC']],
    });
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos.' });
  }
};

// PUT /api/orders/:id/estado — actualizar estado (admin/comerciante)
const updateEstado = async (req, res) => {
  try {
    const orden = await Orden.findByPk(req.params.id);
    if (!orden) return res.status(404).json({ error: 'Orden no encontrada.' });
    await orden.update({ estado: req.body.estado });
    res.json({ mensaje: 'Estado actualizado.', orden });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado.' });
  }
};

module.exports = { createOrden, getMisPedidos, updateEstado };
