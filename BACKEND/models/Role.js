// models/Role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true
  },
  permisos: {
    type: String,
    required: true
  }
});

//trasnsforma el document per a que no retorni el camp __v i retorni un camp id amb el valor de _id
roleSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret, options) => {
      delete ret.__v;

      //id
      ret.id = ret._id.toString();
      delete ret._id;
  },
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
