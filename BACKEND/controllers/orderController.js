const Order = require('../models/Order');
const Incidence = require('../models/Incidents');
const User = require('../models/User');
const OrderProcessState = require('../models/OrderProcessState');
const { format } = require('date-fns');
const mongoose = require('mongoose');
var debug = require('debug')('flightchatDB:controllers:orderController');

const orderController = {
  list: async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 }).lean();
      res.render('orders/list', {
        title: "Gestió de Comandes",
        orders,
        loggedInEmail: req.user?.email || ''
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error carregant comandes');
    }
  },

  createForm: async (req, res) => {
    try {
      const usuaris = await User.find().populate('role_id').lean();
      let incidenciaData = null;

      if (req.query.fromIncidencia) {
        const incidencia = await Incidence.findById(req.query.fromIncidencia).lean();
        if (incidencia) {
          incidenciaData = {
            companya_aerea: incidencia.companya_aerea,
            num_vol: incidencia.num_vol,
            menjar: incidencia.menjar
          };
        }
      }

      res.render('orders/create', {
        usuaris,
        incidenciaData,
        loggedInEmail: req.user?.email || '',
        loggedInUserId: req.user?._id || ''
      });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Error carregant el formulari de comanda');
      res.redirect('/orders');
    }
  },


    create: async (req, res) => {
    try {
      // Obtener datos del usuari autor
      const user = await User.findById(req.user.id).populate('role_id').lean();
      const rolNom = user.role_id?.nom || 'sense-rol';

      const { companya_aerea, num_vol, menjar } = req.body;
      let assignar_equip = req.body.assignar_equip || [];

      // Asegurar que siempre sea un array
      if (!Array.isArray(assignar_equip)) {
        assignar_equip = [assignar_equip];
      }

      // Buscar los usuaris seleccionats y construir objetos embebidos
      const usuarisComplets = await User.find({ _id: { $in: assignar_equip } }).populate('role_id');

      const equipEmbed = usuarisComplets.map(usuari => ({
        _id: usuari._id,
        nom: usuari.nom,
        cognoms: usuari.cognoms,
        email: usuari.email,
        rol: usuari.role_id?.nom || 'sense-rol'
      }));

      // ✅ Crear la comanda
      // Crear la comanda amb l'equip embegut
      const novaComanda = await Order.create({
        autor: {
          _id: user._id,
          nom: user.nom,
          cognoms: user.cognoms,
          email: user.email,
          rol: rolNom
        },
        companya_aerea,
        num_vol,
        menjar,
        assignar_equip: equipEmbed
      });

      // ✅ Crear estat de procés inicial vinculat a la comanda
      await OrderProcessState.create({
        comanda: novaComanda._id,
        //estat: 'pendent' // Este valor puede omitirse si ya está por defecto en el esquema
      });

      req.flash('success_msg', 'Comanda creada correctament');
      res.redirect('/orders');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Error creant la comanda');
      res.redirect('/orders');
    }
  },

  edit: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).lean();
      if (!order) {
        req.flash('error_msg', 'Comanda no trobada');
        return res.redirect('/orders');
      }

      const dataCreacio = order.createdAt
        ? format(order.createdAt, 'yyyy-MM-dd HH:mm')
        : '';

      const assignatsIds = order.assignar_equip.map(u => u._id.toString());

      const usuaris = await User.find().populate('role_id').lean();
          usuaris.forEach(u => {
            u._id = u._id.toString();
          });

      res.render('orders/edit', {
        order,
        assignatsIds, // 👈 nueva variable
        dataCreacio,
        usuaris,        // 🔥 AIXÒ FALTAVA
        loggedInEmail: req.user?.email || ''
      });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Error carregant la comanda');
      res.redirect('/orders');
    }
  },

  update: async (req, res) => {
    try {
      const { companya_aerea, num_vol, menjar, assignar_equip } = req.body;

      // Asegura que assignar_equip sea un array
      let equipIds = assignar_equip || [];
      if (!Array.isArray(equipIds)) {
        equipIds = [equipIds];
      }

      const usuarisComplets = await User.find({ _id: { $in: equipIds } }).populate('role_id');

      const equipEmbed = usuarisComplets.map(usuari => ({
        _id: usuari._id,
        nom: usuari.nom,
        cognoms: usuari.cognoms,
        email: usuari.email,
        rol: usuari.role_id?.nom || 'sense-rol'
      }));

      await Order.findByIdAndUpdate(req.params.id, {
        companya_aerea,
        num_vol,
        menjar,
        assignar_equip: equipEmbed
      });

      req.flash('success_msg', 'Comanda actualitzada correctament');
      res.redirect('/orders');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Error actualitzant la comanda');
      res.redirect('/orders');
    }
  },


  delete: async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      req.flash('success_msg', 'Comanda eliminada correctament');
      res.redirect('/orders');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Error eliminant la comanda');
      res.redirect('/orders');
    }
  },

  show: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).lean();
      if (!order) {
        return res.status(404).send('Comanda no trobada');
      }

      res.render('orders/show', {
        title: 'Detalls de comanda',
        order,
        loggedInEmail: req.user?.email || ''
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error carregant els detalls de la comanda');
    }
  }
};

module.exports = orderController;
