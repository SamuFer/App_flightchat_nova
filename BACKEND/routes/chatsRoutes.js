const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.get('/', ensureAuthenticated('admin', 'oficina'), chatController.listChats);



router.post('/:id/finalitzar', ensureAuthenticated('admin'), chatController.finalizeChat);
router.put('/:id/assignar', ensureAuthenticated('admin'), chatController.updateAssignats);
router.delete('/:id/eliminar', ensureAuthenticated('admin'), chatController.deleteChat);

module.exports = router;