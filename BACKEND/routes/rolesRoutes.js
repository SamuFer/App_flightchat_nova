var express = require('express');
var router = express.Router();

const RoleController = require('../controllers/roleController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.get('/', ensureAuthenticated('admin', 'oficina'), RoleController.list);
router.get('/create', ensureAuthenticated('admin'), RoleController.createForm);
router.post('/', ensureAuthenticated('admin'), RoleController.create);
router.get('/edit/:id', ensureAuthenticated('admin'), RoleController.editForm);
router.put('/update/:id', ensureAuthenticated('admin'), RoleController.update);
router.delete('/delete/:id', ensureAuthenticated('admin'), RoleController.delete);

module.exports = router;