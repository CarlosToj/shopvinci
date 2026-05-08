const Producto = require('../models/Producto');

// GET /api/products — listar con paginación y filtros
const getProductos = async (req, res) => {
  try {
    const { page = 1, limit = 8, categoria_id } = req.query;
    const offset = (page - 1) * limit;
    const where = { activo: true };
    if (categoria_id) where.categoria_id = categoria_id;

    const { count, rows } = await Producto.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']],
    });

    res.json({
      productos: rows,
      total: count,
      paginas: Math.ceil(count / limit),
      paginaActual: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
};

// GET /api/products/:id
const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto || !producto.activo) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
};

// POST /api/products — crear producto (solo comerciante)
const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria_id } = req.body;
    const imagen = req.file ? req.file.filename : null;

    const producto = await Producto.create({
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      categoria_id,
      comerciante_id: req.usuario.id,
    });

    res.status(201).json({ mensaje: 'Producto creado exitosamente.', producto });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto.' });
  }
};

// PUT /api/products/:id — editar producto
const updateProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado.' });
    if (producto.comerciante_id !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso para editar este producto.' });
    }
    await producto.update(req.body);
    res.json({ mensaje: 'Producto actualizado.', producto });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
};

// DELETE /api/products/:id — desactivar producto
const deleteProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado.' });
    if (producto.comerciante_id !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso.' });
    }
    await producto.update({ activo: false });
    res.json({ mensaje: 'Producto eliminado.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
};

module.exports = { getProductos, getProductoById, createProducto, updateProducto, deleteProducto };
