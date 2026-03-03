// ✅ MODIFICAT - controllers/api/chatController.js
const Order = require('../../models/Order');
const Message = require('../../models/Message');

const chatController = {
  listActive: async (req, res) => {
    const chats = await Order.find({ estat: 'activa' }).select('_id companya_aerea num_vol menjar assignar_equip');
    res.json(chats);
  },

  userChats: async (req, res) => {
    const userId = req.params.userId;
    const chats = await Order.find({ 'assignar_equip._id': userId }).select('_id companya_aerea num_vol');
    res.json(chats);
  },

  // ✅ Nova funció per retornar els missatges guardats a MongoDB
  chatMessages: async (req, res) => {
    try {
      const mongoose = require('mongoose');
      const chatId = new mongoose.Types.ObjectId(req.params.chatId);
      const messages = await Message.find({ 'to.comanda_id': chatId }).sort({ createdAt: 1 });
      res.json(messages);
    } catch (err) {
      console.error('❌ Error carregant missatges antics:', err);
      res.status(500).json({ msg: 'Error intern obtenint missatges' });
    }
  }
};

module.exports = chatController;