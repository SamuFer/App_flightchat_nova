const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.get('/', ensureAuthenticated('admin', 'oficina'), companyController.list);
router.post('/create', ensureAuthenticated('admin', 'oficina'), companyController.create);
router.post('/delete/:id', ensureAuthenticated('admin', 'oficina'), companyController.delete);

module.exports = router;
