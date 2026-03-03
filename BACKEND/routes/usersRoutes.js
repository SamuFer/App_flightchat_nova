var express = require('express');
var router = express.Router();

const UserController = require('../controllers/userController')
const { ensureAuthenticated } = require('../middleware/authMiddleware');


/* GET users listing. */
router.get('/', ensureAuthenticated('admin', 'oficina'), UserController.list);

// Formulario de creación
router.get('/create', ensureAuthenticated('admin'), UserController.createForm);

// Guardar nuevo usuario
router.post('/', ensureAuthenticated('admin'), UserController.create);

// Ver un usuario específico
router.get('/:id', ensureAuthenticated('admin'), UserController.show);  // Ruta para mostrar los detalles del usuario

// Formulario de edición
router.get('/edit/:id', ensureAuthenticated('admin'), UserController.edit);

// Actualizar usuario
router.put('/update/:id', ensureAuthenticated('admin'), UserController.update);

// Eliminar usuario
router.delete('/delete/:id', ensureAuthenticated('admin'), UserController.delete);

module.exports = router;
