const User = require('../models/User');
const Role = require('../models/Role');
var debug = require('debug')('flightchatDB:controllers:userController');
const bcrypt = require('bcryptjs');
const { format } = require('date-fns');
const UserController = {
    list: async (req, res) => {
        try {
          const users = await User.find().populate('role_id').lean();
          res.render('users/list', { title: "Gestio d'usuaris", users, loggedInEmail: req.user.email });
        } catch (err) {
          console.error(err);
          res.status(500).send('Error carregant usuaris');
        }
      },

    createForm: async (req, res) => {
      const roles = await Role.find().lean();
      res.render('users/create', { roles });
    },
  
    create: async (req, res) => {
      try {
        const {
          nom,
          cognoms,
          email,
          contrasenya,
          data_naixement,
          telefon,
          role_id
        } = req.body;

        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(contrasenya, salt);
        const estat_compte = req.body.estat_compte === 'on';
        await User.create({
          nom,
          cognoms,
          email,
          contrasenya,
          data_naixement,
          telefon,
          role_id,
          estat_compte
        });
        req.flash('success_msg', 'Usuari creado correctament');
        res.redirect('/users');
      } catch (err) {
        console.error(err);
        res.redirect('/users');
      }
    },
    
  
    edit: async (req, res) => {
      const user = await User.findById(req.params.id).populate('role_id').lean();
      const roles = await Role.find().lean();
      if (!user) {
        req.flash('error_msg', 'Usuari no trobat');
        return res.redirect('/users');
      }

      // Formatear la fecha a YYYY-MM-DD
      const data_naixement_format = user.data_naixement
      ? format(user.data_naixement, 'yyyy-MM-dd')
      : '';

      res.render('users/edit', { user, roles, data_naixement_format, loggedInEmail: req.user.email});
    },
  
    update: async (req, res) => {
      try {
        const { nom, email, role_id } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
          req.flash('error_msg', 'Usuari no trobat');
          return res.redirect('/users');
        }
  
        user.nom = nom;
        user.email = email;
        user.role_id = role_id;
        user.estat_compte = req.body.estat_compte === 'true'; // 👈 Aquí
  
        await user.save();
        req.flash('success_msg', 'Usuari actualitzat correctament');
        res.redirect('/users');
      } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error actualitzant usuari');
        res.redirect('/users');
      }
    },
  
    delete: async (req, res) => {
      try {
        await User.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Usuari eliminat correctament');
        res.redirect('/users');
      } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error eliminant usuari');
        res.redirect('/users');
      }
    },

    // Mostrar un usuario específico
    show: async (req, res) => {
      try {
        const useres = await User.findById(req.params.id).populate('role_id').lean();
        if (!useres) {
          return res.status(404).send('Usuari no trobat');
        }
        res.render('users/show', { title: 'Detalls d\'usuari', useres , loggedInEmail: req.user.email});
      } catch (err) {
        console.error(err);
        res.status(500).send('Error carregant els detalls de l\'usuari');
      }
    }
 };
 module.exports = UserController;