var express = require('express');
var router = express.Router();
const UserController = require('../../controllers/api/userController');

const { ensureJWTAuthenticated } = require('../../middleware/jwt-auth');

router.get('/', ensureJWTAuthenticated, UserController.list);
router.get('/:id', ensureJWTAuthenticated, UserController.get);

module.exports = router;
