const mongoose = require('mongoose');

const incidenceSchema = new mongoose.Schema({
 usuari: {
    _id: mongoose.Schema.Types.ObjectId,
    nom: String,
    cognoms: String,
    email: String,
    rol: String
  },
  companya_aerea: {
    type: String,
    required: true
  },
  num_vol: {
    type: String,
    required: true
  },
  menjar: [
    {
      codi: { type: String, required: true },
      quantitat: { type: Number, required: true }
    }
  ],
  estat: {
    type: String,
    enum: ['pendent', 'acceptada', 'rebutjada'],
    default: 'pendent'
  },
  notificacio_enviada: {
    type: Boolean,
    default: false
  }
}, {
    timestamps: true
});


const Incidence = mongoose.model('Incidence', incidenceSchema);

module.exports = Incidence;
