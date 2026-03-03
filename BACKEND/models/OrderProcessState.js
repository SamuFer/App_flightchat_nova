// models/OrderProcessState.js
const mongoose = require('mongoose');

const OrderProcessStateSchema = new mongoose.Schema({
  comanda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  estat: {
    type: String,
    enum: ['pendent','en produccion', 'en transito', 'entregado'],
    default: 'pendent'
  },
}, { timestamps: true });

const OrderProcessState = mongoose.model('OrderProcessState', OrderProcessStateSchema);
module.exports = OrderProcessState;
