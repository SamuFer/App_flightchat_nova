const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  cognoms: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  contrasenya: {
    type: String,
    required: true
  },
  data_naixement: {
    type: Date,
    required: true
  },
  telefon: {
    type: String,
    required: true
  },
  avatar: {
    type: Buffer // puedes usar .toString('base64') para servirlo
  },
  estat_compte: {
    type: Boolean,
    default: true
  },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  jwt_version: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});
//trasnsforma el document per a que no retorni el camp __v i retorni un camp id amb el valor de _id
userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
      delete ret.__v;
      delete ret.contrasenya;
      delete ret.jwt_version;

      //id
      ret.id = ret._id.toString();
      delete ret._id;

      //avatar
      if (ret.avatar) {
        const b = Buffer.from(ret.avatar);
        ret.avatar = b.toString('base64');
      }
  },
});
// 🔐 Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('contrasenya')) return next(); // Si no se modifica la contraseña, sigue adelante

  try {
  const salt = await bcrypt.genSalt(10); // Genera un "salt" para el hash
  this.contrasenya = await bcrypt.hash(this.contrasenya, salt); // Hashea la contraseña
  next();
  } catch (error) {
  next(error);
  }
});

// 🔍 Método para comparar contraseñas
userSchema.methods.compararContrasenya = async function (contrasenyaIngresada) {
  return await bcrypt.compare(contrasenyaIngresada, this.contrasenya);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
