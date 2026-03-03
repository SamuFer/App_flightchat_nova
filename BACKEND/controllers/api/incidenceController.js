const Incidence = require('../../models/Incidents');
const User = require('../../models/User');

const IncidenceController = {
  crearIncidence: async (req, res) => {
    try {
      const userEmail = req.user.email;
      const user = await User.findOne({ email: userEmail });
  
      if (!user) return res.status(404).json({ error: 'Usuari no trobat' });
  
      const { companyia, vol, items } = req.body;
  
      if (!companyia || !vol || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Dades incompletes' });
      }
  
      const menjar = items.map(item => {
        const [codi, quantitat] = item.split(' - ');
        return {
          codi: codi.trim(),
          quantitat: parseInt(quantitat)
        };
      });
  
      const novaIncidencia = new Incidence({
        usuari: {
          _id: user._id,
          nom: user.nom,
          cognoms: user.cognoms,
          email: user.email
        },
        companya_aerea: companyia,
        num_vol: vol,
        menjar
      });
  
      await novaIncidencia.save();
      res.status(201).json(novaIncidencia);
    } catch (err) {
      console.error('Error creant la incidència:', err);
      res.status(500).json({ error: 'Error intern del servidor' });
    }
  },

  list: async (req, res) => {
    try {
      const userEmail = req.user.email;
      const incidencies = await Incidence.find({ 'usuari.email': userEmail }).sort({ createdAt: -1 });
  
      res.status(200).json(incidencies);
    } catch (err) {
      console.error('Error carregant incidències:', err);
      res.status(500).json({ error: 'Error en obtenir les incidències' });
    }
  }
};

module.exports = IncidenceController;