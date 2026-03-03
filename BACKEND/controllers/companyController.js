const Company = require('../models/Company');

const companyController = {
  list: async (req, res) => {
    const companies = await Company.find();
    res.render('companies/list', { companies });
  },
  create: async (req, res) => {
    const { companyia, vols } = req.body;
    await Company.create({ companyia, vols: vols.split(',') });
    req.flash('success_msg', 'Companya de vol creada correctament');
    res.redirect('/companies');
  },
  delete: async (req, res) => {
    await Company.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Companya de vol eliminat correctament');
    res.redirect('/companies');
  }
};

module.exports = companyController;
