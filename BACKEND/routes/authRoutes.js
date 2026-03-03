var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
var passport = require('passport');
const { forwardAuthenticated, ensureAuthenticated } = require('../middleware/authMiddleware');
const { doubleCsrfProtection } = require('../middleware/csrfMiddleware');


// Controladores
const AuthController = require('../controllers/authController');

// Página de login solo accesible si NO está autenticado
router.get('/login', forwardAuthenticated, AuthController.loginForm);
router.post('/login', doubleCsrfProtection, AuthController.login);
// Logout
router.get('/logout', AuthController.logout);

module.exports = router;
