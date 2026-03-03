const Order = require('../models/Order');
const Message = require('../models/Message');
const User = require('../models/User');
const OrderProcessState = require('../models/OrderProcessState');
const mongoose = require('mongoose');

const chatController = {
   listChats: async (req, res) => {
    // Buscar solo las órdenes activas
    const orders = await Order.find()
      .populate('assignar_equip') // <-- importante si quieres mostrar nombre, etc.
      .sort({ createdAt: -1 });

    // Obtener todos los estados relacionados a esas órdenes
    const orderIds = orders.map(order => order._id);
    const estados = await OrderProcessState.find({ comanda: { $in: orderIds } });

    // Mapear estado a la orden para enviarlo a la vista
    const chats = orders.map(order => {
      const estado = estados.find(e => e.comanda.toString() === order._id.toString());

      const assignatsIds = (order.assignar_equip || []).map(u => u._id?.toString());

      // Recuperar IDs añadidos desde sesión
      const nousAssignatsIds = (req.session.usuarisNous?.[order._id.toString()] || []);

      return {
        ...order.toObject(),
        estatProcés: estado?.estat || 'null',
        assignatsIds, // 👈 nuevo campo para la vista
        nousAssignatsIds
      };
    });
    // 👇 Aquí cargas todos los usuarios posibles para anidar
    const usuaris = await User.find().populate('role_id').lean();
          usuaris.forEach(u => {
            u._id = u._id.toString();
          });
    const usuarisNous = req.session.usuarisNous || [];
    req.session.usuarisNous = null; // Limpia para que no se mantenga siempre

    res.render('chats/list', { chats, usuaris, loggedInEmail: req.user?.email || '',usuarisNous });
  },

  finalizeChat: async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, { estat: 'tancada' });
    req.flash('success_msg', 'Chat tancat correctament');
    res.redirect('/chats');
  },

  updateAssignats: async (req, res) => {
    try {
      const { assignar_equip } = req.body;

      const usuarisAssignats = Array.isArray(assignar_equip)
        ? assignar_equip
        : assignar_equip ? [assignar_equip] : [];

      // Traer la orden actual para comparar
      const orderOriginal = await Order.findById(req.params.id).lean();

      const idsAntes = (orderOriginal.assignar_equip || []).map(u => u._id.toString());

      // Buscar usuarios completos para embebido
      const usuarisComplets = await User.find({ _id: { $in: usuarisAssignats } })
        .populate('role_id')
        .lean();

      const usuarisPerAssignar = usuarisComplets.map(u => ({
        _id: u._id,
        nom: u.nom,
        cognoms: u.cognoms,
        email: u.email,
        rol: u.role_id?.nom || 'sense-rol'
      }));

      const idsAhora = usuarisPerAssignar.map(u => u._id.toString());

      // Detectar añadidos y eliminados
      const añadidos = idsAhora.filter(id => !idsAntes.includes(id));
      // Guardar en sesión para resaltado (clave: ID de orden)
      if (!req.session.usuarisNous) req.session.usuarisNous = {};
      req.session.usuarisNous[req.params.id] = añadidos;

      const eliminados = idsAntes.filter(id => !idsAhora.includes(id));

      // Obtener nombres completos para consola
      const usuarisAfegits = usuarisPerAssignar.filter(u => añadidos.includes(u._id.toString()));
      const usuarisEliminats = (orderOriginal.assignar_equip || []).filter(u => eliminados.includes(u._id.toString()));

      console.log('Usuaris afegits:', usuarisAfegits.map(u => `${u.nom} ${u.cognoms} (${u._id})`));
      console.log('Usuaris eliminats:', usuarisEliminats.map(u => `${u.nom} ${u.cognoms} (${u._id})`));

      // Actualizar la orden
      await Order.findByIdAndUpdate(req.params.id, {
        assignar_equip: usuarisPerAssignar
      });

      req.flash('success_msg', 'Participants assignats actualitzats correctament');
      res.redirect('/chats');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Error actualitzant participants assignats');
      res.redirect('/chats');
    }
  },


  deleteChat: async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    await Message.deleteMany({ comanda_id: req.params.id });
    req.flash('success_msg', 'Chat i missatges eliminats');
    res.redirect('/chats');
  }
};
module.exports = chatController;