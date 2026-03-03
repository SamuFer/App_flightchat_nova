const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { format } = require('date-fns');

const ProfileController = {
  show: async (req, res) => {
    res.render('profile/show', { title: "perfil", user: req.user });
  },

  edit: async (req, res) => {
    const user = req.user;
    const data_naixement_format = user.data_naixement
      ? format(new Date(user.data_naixement), 'yyyy-MM-dd')
      : '';
  
    res.render('profile/edit', {
      user,
      data_naixement_format
    });
  },
  
  update: async (req, res) => {
    try {
      const { nom, cognoms, email, telefon, data_naixement } = req.body;
      const user = await User.findById(req.user.id);
  
      user.nom = nom;
      user.cognoms = cognoms;
      user.email = email;
      user.telefon = telefon;
      user.data_naixement = data_naixement;
  
      await user.save();
      req.flash('success_msg', 'Perfil actualizado correctamente.');
      res.redirect('/profile');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Error al actualizar el perfil.');
      res.redirect('/profile/edit');
    }
  }
  
};

module.exports = ProfileController;

  