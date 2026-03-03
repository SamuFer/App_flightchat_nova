const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.get('/', ensureAuthenticated('admin', 'oficina'), orderController.list);

router.get('/create', ensureAuthenticated('admin'), orderController.createForm);

router.post('/', ensureAuthenticated('admin'), orderController.create);

router.get('/:id', ensureAuthenticated('admin'), orderController.show);

router.get('/edit/:id', ensureAuthenticated('admin'), orderController.edit);

router.put('/update/:id', ensureAuthenticated('admin'), orderController.update);

router.delete('/delete/:id', ensureAuthenticated('admin'), orderController.delete);

module.exports = router;
