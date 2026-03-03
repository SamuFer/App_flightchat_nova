const Meal = require('../models/Meal');

const mealController = {
  list: async (req, res) => {
    const meals = await Meal.find();
    res.render('meals/list', { meals });
  },
  create: async (req, res) => {
    const { codi } = req.body;
    await Meal.create({ codi });
    req.flash('success_msg', 'menjar creada correctament');
    res.redirect('/meals');
  },
  delete: async (req, res) => {
    await Meal.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'menjar eliminat correctament');
    res.redirect('/meals');
  }
};

module.exports = mealController;
