const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/api/orderController');
const { ensureJWTAuthenticated } = require('../../middleware/jwt-auth');

// 🔐 Rutes protegides amb JWT

// Llistar totes les comandes
router.get('/', ensureJWTAuthenticated, orderController.getAllOrders);

// Llistar comandes actives (si "tancada" no és actiu)
router.get('/actives', ensureJWTAuthenticated, orderController.getActiveOrders);

// Obtenir una comanda per ID
router.get('/:id', ensureJWTAuthenticated, orderController.getOrderById);

// Crear nova comanda
router.post('/', ensureJWTAuthenticated, orderController.createOrder);

// (Opcional) Actualitzar una comanda
router.put('/:id', ensureJWTAuthenticated, orderController.updateOrder);

// (Opcional) Esborrar una comanda
router.delete('/:id', ensureJWTAuthenticated, orderController.deleteOrder);

module.exports = router;