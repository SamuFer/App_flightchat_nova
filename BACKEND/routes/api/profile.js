const express = require('express');
const multer = require('multer');
const router = express.Router();
const { ensureJWTAuthenticated } = require('../../middleware/jwt-auth');
const User = require('../../models/User');
const fs = require('fs');

// Configuración multer para subida temporal
const upload = multer({ dest: 'uploads/' });

// GET /api/profile - obtener perfil
router.get('/', ensureJWTAuthenticated, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const user = await User.findOne({ email: userEmail }).populate('role_id').lean();

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (user.avatar && Buffer.isBuffer(user.avatar)) {
      user.avatar = `data:image/png;base64,${user.avatar.toString('base64')}`;
    }

    res.json(user);
  } catch (error) {
    console.error('Error obteniendo el perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/profile/avatar - subir avatar
router.post('/avatar', ensureJWTAuthenticated, upload.single('avatar'), async (req, res) => {
  try {
    const userEmail = req.user.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (req.file) {
      user.avatar = fs.readFileSync(req.file.path);
      fs.unlinkSync(req.file.path); // Eliminar archivo temporal
    }

    await user.save();

    res.json({
      message: 'Avatar subido correctamente',
      avatar: `data:image/png;base64,${user.avatar.toString('base64')}`
    });
  } catch (error) {
    console.error('Error subiendo el avatar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/profile/update - actualizar perfil
router.put('/update', ensureJWTAuthenticated, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { nom, cognoms, telefon, email, data_naixement } = req.body;

    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    user.nom = nom ?? user.nom;
    user.cognoms = cognoms ?? user.cognoms;
    user.telefon = telefon ?? user.telefon;
    user.email = email ?? user.email;
    user.data_naixement = data_naixement ?? user.data_naixement;

    await user.save();

    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando el perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
