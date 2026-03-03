var express = require('express');
var router = express.Router();

const IndexController = require('../controllers/indexController')
const { ensureAuthenticated } = require('../middleware/authMiddleware');

/* GET home page. */
// Welcome Page
router.get('/', ensureAuthenticated('admin', 'oficina'),IndexController.index);
module.exports = router;