const express = require('express');
const router = express.Router();
const chatController = require('../../controllers/api/chatController');
const { ensureJWTAuthenticated } = require('../../middleware/jwt-auth');

router.get('/actius', ensureJWTAuthenticated, chatController.listActive);
router.get('/:userId', ensureJWTAuthenticated, chatController.userChats);

// ✅ Nova ruta per obtenir missatges antics d'un xat
router.get('/:chatId/messages', ensureJWTAuthenticated, chatController.chatMessages);


module.exports = router;