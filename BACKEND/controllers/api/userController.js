const debug = require('debug')('flightchatDB:controllers:api:userController');
const User = require('../../models/User');

const UserController = {
     list: async (req, res, next) => {
            debug("List usuaris");
            //no recuperem les imatges per no sobre carregar la xarxa
            const data = await User.find({}, { avatar: 0 });
            res.json(data);
        },
    
    get: async (req, res, next) => {
        debug("Get usuari: ", req.params.id);
        try {
            const data = await User.findById(req.params.id);
            if (!data) {
                throw new Error("Not found");
            }

            res.json(data);
        } catch (error) {
            res.status(404).json({
                message: error.message
            });
        }
    }
};

module.exports = UserController;
