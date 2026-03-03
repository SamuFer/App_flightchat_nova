const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  companyia: String,
  vols: [String]
});

 const Company = mongoose.model('Company', CompanySchema);
 module.exports = Company;