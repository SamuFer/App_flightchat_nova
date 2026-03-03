// controllers/api/orderController.js

const Order = require('../../models/Order');

// ✅ Llistar totes les comandes
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('❌ Error obtenint totes les comandes:', err);
    res.status(500).json({ error: 'Error intern del servidor' });
  }
};

// ✅ Llistar només comandes actives (que no estiguin tancades)
exports.getActiveOrders = async (req, res) => {
  try {
    const orders = await Order.find({ estat: { $ne: 'tancada' } }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('❌ Error obtenint comandes actives:', err);
    res.status(500).json({ error: 'Error intern del servidor' });
  }
};

// ✅ Obtenir una comanda per ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Comanda no trobada' });
    res.json(order);
  } catch (err) {
    console.error('❌ Error obtenint comanda per ID:', err);
    res.status(500).json({ error: 'Error intern del servidor' });
  }
};

// ✅ Crear nova comanda
exports.createOrder = async (req, res) => {
  try {
    const novaComanda = new Order(req.body);
    const saved = await novaComanda.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error creant comanda:', err);
    res.status(400).json({ error: 'Error en crear la comanda' });
  }
};

// ✅ (Opcional) Actualitzar una comanda
exports.updateOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Comanda no trobada' });
    res.json(updated);
  } catch (err) {
    console.error('❌ Error actualitzant comanda:', err);
    res.status(400).json({ error: 'Error en actualitzar la comanda' });
  }
};

// ✅ (Opcional) Eliminar una comanda
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Comanda no trobada' });
    res.json({ missatge: 'Comanda eliminada correctament' });
  } catch (err) {
    console.error('❌ Error eliminant comanda:', err);
    res.status(500).json({ error: 'Error en eliminar la comanda' });
  }
};