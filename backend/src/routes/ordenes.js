const express = require('express');
const router = express.Router();
const { createOrden, getMisPedidos, updateEstado } = require('../controllers/ordenesController');
const { verificarToken, soloAdmin } = require('../middleware/auth');

router.post('/', verificarToken, createOrden);
router.get('/mis-pedidos', verificarToken, getMisPedidos);
router.put('/:id/estado', verificarToken, soloAdmin, updateEstado);

module.exports = router;
