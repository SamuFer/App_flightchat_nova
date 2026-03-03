const OrderProcessState = require('../../models/OrderProcessState');

const processController = {
  updateEstado: async (req, res) => {
    try {
      const { comanda_id, nouEstat } = req.body;

      if (!['en produccion', 'en transito', 'entregado'].includes(nouEstat)) {
        return res.status(400).json({ msg: 'Estat invàlid' });
      }

      const estatActualitzat = await OrderProcessState.findOneAndUpdate(
        { comanda: comanda_id },
        { estat: nouEstat },
        { new: true }
      );

      if (!estatActualitzat) {
        return res.status(404).json({ msg: 'Comanda no trobada o sense estat' });
      }

      // Emitir al socket el nuevo estado
      req.app.get('io').to(comanda_id).emit('estatActualitzat', {
        comanda_id,
        estat: nouEstat
      });

      res.json(estatActualitzat);
    } catch (err) {
      console.error('❌ Error actualitzant procés:', err);
      res.status(500).json({ msg: 'Error intern actualitzant el procés' });
    }
  }
};

module.exports = processController;
