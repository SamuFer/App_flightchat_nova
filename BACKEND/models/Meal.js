const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  codi: {
    type: String,
    required: true,
    unique: true
  }
});

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal