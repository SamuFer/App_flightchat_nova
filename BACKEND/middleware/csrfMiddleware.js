const { doubleCsrf } = require('csrf-csrf');

const csrf = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,  // Utiliza un valor de configuración para el secreto
  getTokenFromRequest: req => req.body.csrfToken,  // Esto debe coincidir con el campo del formulario
  cookieName: process.env.NODE_ENV === 'production' ? '__Host-prod.x-csrf-token' : '_csrf',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',  // Solo habilitar en producción
    httpOnly: true,  // Para mayor seguridad, no permitir que sea accesible desde JavaScript
    sameSite: 'Strict',  // Asegura que las cookies no se envíen entre sitios
  }
});

module.exports = {
  doubleCsrfProtection: csrf.doubleCsrfProtection,
  generateToken: csrf.generateToken
};
