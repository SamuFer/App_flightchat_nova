var express = require('express');
var router = express.Router();

const IncidenceController = require('../controllers/incidenceController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');


/* GET incidence listing. */
router.get('/', ensureAuthenticated('admin'), IncidenceController.list);

// Vista detallada
router.get('/:id',ensureAuthenticated('admin'), IncidenceController.show);

// Formulario de revisio
router.put('/:id/review', ensureAuthenticated('admin'), IncidenceController.review);

router.delete('/delete/:id', ensureAuthenticated('admin'), IncidenceController.delete);



module.exports = router;