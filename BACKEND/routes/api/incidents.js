const express = require('express');
const router = express.Router();
const IncidenceController = require('../../controllers/api/incidenceController');
const { ensureJWTAuthenticated } = require('../../middleware/jwt-auth');

router.post('/', ensureJWTAuthenticated, IncidenceController.crearIncidence);

// ✅ LLISTA totes les incidències de l’usuari autenticat
router.get('/', ensureJWTAuthenticated, IncidenceController.list);

module.exports = router;

