const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isBackendUser } = require('../utils/roles');
module.exports = function(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'contrasenya' }, 
      async (email, contrasenya, done) => {
        try {
          const user = await User.findOne({ email }).populate('role_id');
          if (!user) {
            return done(null, false, { message: 'Ese email no está registrado' });
          }

          const isMatch = await bcrypt.compare(contrasenya, user.contrasenya);
          if (isMatch) {
            if (isBackendUser(user)) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'No tienes permisos para acceder al sistema.' });
            }
          } else {
            return done(null, false, { message: 'Contraseña incorrecta' });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).populate('role_id');
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
