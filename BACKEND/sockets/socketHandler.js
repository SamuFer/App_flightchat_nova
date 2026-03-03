// BACKEND/sockets/socketHandler.js

const Message = require('../models/Message');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (io) => {
    io.on('connection', async (socket) => {
        console.log('🟢 Connexió de socket establerta:', socket.id);

        const token = socket.handshake.auth?.token;
        if (!token) {
            console.warn('⚠️ Falta token de connexió');
            return socket.disconnect();
        }

        let user;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            user = await User.findById(decoded.user_id);
            if (!user) {
                console.warn('❌ Usuari no trobat a la base de dades');
                return socket.disconnect();
            }
            console.log('✅ Usuari autenticat via socket:', user.email);
        } catch (err) {
            console.error('❌ Token JWT invàlid:', err.message);
            return socket.disconnect();
        }

        // Escolta per unir-se a una sala de xat
        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
            console.log(`👤 Usuari ${user.email} s'ha unit a la sala ${chatId}`);
            console.log('🏠 Sales del socket:', [...socket.rooms]);
        });

        // Escolta per rebre i reenviar missatges
        socket.on('sendMessage', async ({ chatId, message }) => {
            try {
                console.log('📥 Missatge rebut al backend via socket.io:');
                console.log('   🔸 chatId:', chatId);
                console.log('   🔸 contingut:', message.content);
                console.log('   🔸 autor:', user.email);

                const nouMissatge = await Message.create({
                    to: { comanda_id: chatId },
                    from: {
                        _id: user._id,
                        nom: user.nom,
                        cognoms: user.cognoms,
                        email: user.email,
                        rol: user.rol
                    },
                    content: message.content
                });

                io.to(chatId).emit('newMessage', nouMissatge);
                console.log(`📨 Missatge enviat a sala ${chatId}:`, nouMissatge.content);
            } catch (err) {
                console.error('❌ Error creant o enviant el missatge:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log('🔴 Desconnexió socket:', socket.id);
        });
    });
};