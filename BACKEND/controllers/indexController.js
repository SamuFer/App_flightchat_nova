var debug = require('debug')('flightchatDB:controllers:indexController');

const IndexController = {
    index:(req, res, next)=>{
        res.render("index", { title: 'Inici', user: req.user || null  });
    }
 }
 
 
 module.exports = IndexController;
 