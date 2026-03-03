const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.get('/', ensureAuthenticated('admin', 'oficina'), mealController.list);
router.post('/create', ensureAuthenticated('admin', 'oficina'), mealController.create);
router.post('/delete/:id', ensureAuthenticated('admin', 'oficina'), mealController.delete);

module.exports = router;
