const express = require('express');
const router = express.Router();
const Meal = require('../../models/Meal');

router.get('/', async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: 'Error al carregar els àpats' });
  }
});

module.exports = router;