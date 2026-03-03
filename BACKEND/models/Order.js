const mongoose = require('mongoose');

const assignar_equipSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nom: String,
  cognoms: String,
  email: String,
  rol: String
});

const orderSchema = new mongoose.Schema({
  autor: {
    _id: mongoose.Schema.Types.ObjectId,
    nom: String,
    cognoms: String,
    email: String,
    rol: String
  },
  companya_aerea: String,
  num_vol: String,
  menjar: [
    {
      codi: String,
      quantitat: Number
    }
  ],
 estat: {
    type: String,
    enum: ['activa', 'tancada', 'cancel·lada'],
    default: 'activa'
  },
  assignar_equip: [assignar_equipSchema]  // Embebido
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;