const session = require('express-session');
const mongoose = require('mongoose');
var MongoStore = require('connect-mongo');
const passport = require('passport');
module.exports = function(app) {
  

  // Express session
  app.use(session({
    secret:'secret', // Clave secreta para la sesión
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }, // 1 hora 
    //store the session in the database
    store: MongoStore.create({
      client: mongoose.connection.getClient(), // Guarda en MongoDB la sesión   
      ttl: 14 * 24 * 60 * 60 // Tiempo de vida de la sesión (14 días)
    }) 
  }));


};
