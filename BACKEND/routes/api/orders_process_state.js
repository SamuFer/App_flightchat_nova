const express = require('express');
const router = express.Router();
const processController = require('../../controllers/api/order_processController');
const { ensureJWTAuthenticated } = require('../../middleware/jwt-auth');

router.post('/update', ensureJWTAuthenticated, processController.updateEstado);

module.exports = router;
