#!/usr/bin/env node

const app = require('../app');
const debug = require('debug')('backend:server');
const http = require('http');
const { Server } = require('socket.io');

// Crear servidor HTTP
const server = http.createServer(app);

// Inicialitzar socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8100', // Canvia-ho si el teu frontend està en un altre domini + localhost 06/06/2025
    methods: ['GET', 'POST']
  }
});

// Assignar io a l'app per accedir-hi des de controllers
app.set('io', io);

// Enllaçar socketHandler
require('../sockets/socketHandler')(io);

// Escollir port i iniciar servidor
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

server.listen(port); // borrar 0000 si vols que escolti només a localhost 06/06/2025
server.on('error', onError);
server.on('listening', onListening);

// Helpers
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requereix privilegis elevats');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' ja està en ús');
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Escoltant a ' + bind);
  console.log('🚀 Servidor en marxa al port', bind);
}