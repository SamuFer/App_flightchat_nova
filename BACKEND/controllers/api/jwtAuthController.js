const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Role = require('../../models/Role');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const debug = require('debug')('flightchatDB:controllers:api.jwtAuthController');

const JWTAuthController = {
    login: async (req, res, next) => {
        if (!req.body.email || !req.body.contrasenya) {
            return res.status(400).json({
                message: 'Please enter email and password.'
            });
        }

        const email = req.body.email;
        const contrasenya = req.body.contrasenya;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                message: 'Authentication failed. User not found.'
            });
        }
        // validar si l'usuari està actiu
        if (!user.estat_compte) {
            return res.status(200).json({
                estat_compte: false,
                message: "El teu compte encara no ha estat validat per l'administrador."
            });
        }


        if (await user.compararContrasenya(contrasenya)) { // 👈 Usa await aquí
            debug("Login user: ", user.email);

            const payload = {
                user_id: user.id,
                jwt_version: user.jwt_version
            };
            const jwt_token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2 days"
            });

            return res.json({ ...user.toJSON(), jwt_token: jwt_token }); // 👈 Usa return aquí
        } else {
            return res.status(401).json({ // 👈 Usa return aquí también
                message: 'Authentication failed. Passwords did not match.'
            });
        }
    },

    logout: async (req, res, next) => {
        debug("Logout user: ", req.user.email);
        req.user.jwt_version += 1;
        await req.user.save();

        res.json({
            data: {}
        });
    },

    register: async (req, res) => {
        try {
            const { nom, cognoms, email, contrasenya, data_naixement, telefon } = req.body;

            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ msg: 'Aquest correu ja està registrat.' });
            }

            //   const salt = await bcrypt.genSalt(10);
            //   const hashedPassword = await bcrypt.hash(contrasenya, salt);

            // Buscar rol "repartidor"
            const role = await Role.findOne({ nom: 'repartidor' });
            if (!role) return res.status(500).json({ msg: 'Rol "repartidor" no trobat.' });

            const newUser = new User({
                nom,
                cognoms,
                email,
                contrasenya,
                data_naixement,
                telefon,
                role_id: role._id,
                estat_compte: false // 👈 desactiva por defecto
            });

            await newUser.save();

            return res.status(201).json({ msg: 'Usuari registrat correctament' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Error al registrar l\'usuari' });
        }
    }

}
module.exports = JWTAuthController;