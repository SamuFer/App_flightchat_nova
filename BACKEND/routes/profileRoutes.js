const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.get('/', ensureAuthenticated('admin', 'oficina'), ProfileController.show);
router.get('/edit', ensureAuthenticated('admin', 'oficina'), ProfileController.edit);
router.put('/update', ensureAuthenticated('admin', 'oficina'), ProfileController.update);

module.exports = router;
