module.exports = {
  ensureAuthenticated: (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.isAuthenticated()) {
        req.flash('error_msg', 'Por favor, inicia sesión para acceder.');
        return res.redirect('/auth/login');
      }

      const userRole = req.user?.role_id?.nom;

      if (allowedRoles.includes(userRole)) {
        res.locals.user = req.user;
        return next();
      }

      req.flash('error_msg', 'rol no autoritzat.');
      return res.redirect('/');
    };
  },

  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/'); // Redirige a la página principal si ya está autenticado
  },
};