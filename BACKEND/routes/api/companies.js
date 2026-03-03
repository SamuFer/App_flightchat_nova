const express = require('express');
const router = express.Router();
const Company = require('../../models/Company');

router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtenir les companyies' });
  }
});

module.exports = router;