const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getProductos, getProductoById, createProducto, updateProducto, deleteProducto } = require('../controllers/productosController');
const { verificarToken, soloComerciante } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', verificarToken, soloComerciante, upload.single('imagen'), createProducto);
router.put('/:id', verificarToken, soloComerciante, updateProducto);
router.delete('/:id', verificarToken, soloComerciante, deleteProducto);

module.exports = router;
