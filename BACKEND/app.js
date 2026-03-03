var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const { doubleCsrfProtection } = require('./middleware/csrfMiddleware'); // Importa tu middleware CSRF
//rutes backend
var indexRouter = require('./routes/indexRoutes');
var usersRouter = require('./routes/usersRoutes');
var rolesRouter = require('./routes/rolesRoutes');
var authRoutes = require('./routes/authRoutes');
var profileRoutes = require('./routes/profileRoutes');
var incidenceRoutes = require('./routes/incidentsRoutes');
var orderRoutes = require('./routes/ordersRoutes');
var chatsRoutes = require('./routes/chatsRoutes');
var companiesRoutes = require('./routes/companiesRoutes');
var mealsRoutes = require('./routes/mealsRoutes');

//rutes api-frontend
var jwtAuthRouter = require('./routes/api/jwt-auth');
var usuarisRouter = require('./routes/api/users');
var incidenciesRouter = require('./routes/api/incidents');
var companyRouter = require('./routes/api/companies');
var mealsRouter = require('./routes/api/meals');
var xatsRouter = require('./routes/api/chats');
var messagesRouter = require('./routes/api/messages');
var comandaRoutes = require('./routes/api/orders');
var orderProcessRouter = require('./routes/api/orders_process_state');
var perfilRoutes = require('./routes/api/profile');
var openskyRoutes = require('./routes/api/opensky');
var uploadsRouter = require('./routes/api/uploads');

const { format } = require('date-fns');
const methodOverride = require('method-override');

var app = express();
// Configuración de la sesión
const passport = require('passport');

// view engine setup
const nunjucks = require('nunjucks');

const env = nunjucks.configure('views', {
  express: app,
  autoescape: true,
});
// ✅ REGISTRA EL FILTRO base64 AQUÍ
env.addFilter('b64encode', function (buffer) {
  return buffer.toString('base64');
});
// Filtro personalizado para formatear fechas
env.addFilter('formatDate', (date, pattern = 'yyyy-MM-dd') => {
  try {
    return format(new Date(date), pattern);
  } catch {
    return '';
  }
});

app.engine('html', nunjucks.render);
app.set('view engine', 'html');

/**
* MongoDB connection
*/
const connectToDatabase = require('../BACKEND/config/database');
connectToDatabase()

/**
 * JWT configuration
 */
require('./config/jwt_passport')(app);

app.use(methodOverride('_method'));
app.use(cookieParser()); // Ha d'anar abans de `doubleCsrfProtection`
// Configurar sesión, flash y passport
require('./config/session')(app)
require('./config/passport')(passport)
require('./config/flash')(app)

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configurar CORS para permitir solicitudes desde el frontend
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

app.use((req, res, next) => {
  res.locals.currentUrl = req.originalUrl;
  next();
});

// rutes backend
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/roles', rolesRouter);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/incidents', incidenceRoutes);
app.use('/orders', orderRoutes);
app.use('/chats', chatsRoutes);
app.use('/companies', companiesRoutes);
app.use('/meals', mealsRoutes);

// rutes api-frontend
app.use('/api/auth', jwtAuthRouter);
app.use('/api/users', usuarisRouter);
app.use('/api/incidents', incidenciesRouter);
app.use('/api/companies', companyRouter);
app.use('/api/meals', mealsRouter);
app.use('/api/chats', xatsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/orders', comandaRoutes);
app.use('/api/orders_process', orderProcessRouter);
app.use('/api/profile', perfilRoutes);
app.use('/api/opensky', openskyRoutes);
app.use('/api/uploads', uploadsRouter);
app.use('/uploads', express.static('uploads')); // Serveix fitxers públicament


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

});

module.exports = app;
