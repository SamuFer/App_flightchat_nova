const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { doubleCsrfProtection, generateToken } = require('../middleware/csrfMiddleware');

const AuthController = {
  loginForm: (req, res) => {
    const csrfToken = generateToken(req, res); // solo necesitas pasar `res`
    console.log("Token CSRF generat:", csrfToken);
    res.render('auth/login', { csrfToken });
  },

  login: (req, res, next) => {  
    console.log("Token CSRF recibido:", req.body.csrfToken);  // Verifica si el token CSRF está presente en el cuerpo de la solicitud
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        req.flash('error_msg', info.message);
        return res.redirect('/auth/login');
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }


        req.flash('success_msg', 'Sessió iniciada correctament');
        return res.redirect('/'); // Cambia al destino deseado
      });
    })(req, res, next);
  },

  logout: (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success_msg', 'Has tancat sesió correctament');
      res.redirect('/auth/login');
    });
  },

//   changePasswordForm: (req, res) => {
//     res.render('auth/change-password');
//   }
};

module.exports = AuthController;