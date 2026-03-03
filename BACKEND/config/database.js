const mongoose = require('mongoose')
const debug = require('debug')('flightchatDB:config:database');


require('dotenv').config();


function connectToDatabase() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🟢 Conectado a MongoDB'))
    .catch(err => console.error('🔴 Error al conectar a MongoDB:', err));
}


module.exports = connectToDatabase