const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  to: {
    comanda_id: mongoose.Schema.Types.ObjectId
  },
  from: {
    _id: mongoose.Schema.Types.ObjectId,
    nom: String,
    cognoms: String,
    email: String,
    rol: String
  },
  content: { type: String },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
