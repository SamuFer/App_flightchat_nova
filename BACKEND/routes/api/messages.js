const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/api/messageController');
const { ensureJWTAuthenticated } = require('../../middleware/jwt-auth');


router.get('/:comandaId', ensureJWTAuthenticated, messageController.list);
router.post('/', ensureJWTAuthenticated, messageController.create);

module.exports = router;