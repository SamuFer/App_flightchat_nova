const Message = require('../../models/Message');

const messageController = {
    list: async (req, res) => {
        const messages = await Message.find({ comanda_id: req.params.comandaId }).sort({ createdAt: 1 });
        res.json(messages);
    },

    create: async (req, res) => {
        const { comanda_id, content } = req.body;
        const user = req.user; // asegurarte que tienes el user de sesión

        const message = await Message.create({
            to: { comanda_id },
            from: {
                _id: user._id,
                nom: user.nom,
                cognoms: user.cognoms,
                email: user.email,
                rol: user.rol
            },
            content
        });

        req.app.get('io').to(comanda_id).emit('newMessage', message);
        res.status(201).json(message);
    },
     // ✅ NOVA FUNCIONALITAT: missatges ràpids per rol
    quickMessages: async (req, res) => {
        const { chatId } = req.query;
        const role = req.user?.rol;

        const missatgesPerRol = {
        produccio: ['Producció iniciada', 'Comanda preparada'],
        repartidor: ['En ruta', 'Entrega completada'],
        oficina: ['Documentació OK', 'Confirmació rebuda'],
        superadmin: ['Revisió finalitzada', 'Tot correcte']
        };

        const result = missatgesPerRol[role] || [];
        res.json(result);
    }
};

module.exports = messageController;