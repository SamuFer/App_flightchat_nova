
const Role = require('../models/Role');

const RoleController = {
    //llista
    list: async (req, res, next) => {
        try {
            const roles = await Role.find();
            res.render("roles/list", { roles, title: "Gestio de rols", });
          } catch (err) {
            res.status(500).json({ error: 'Error al obtenir els rols' });
          }
    },
    
    // Mostrar formulari de creació
    createForm: (req, res) => {
      res.render("roles/create", { title: "Crear Rol", role: {} });
    },

    // Crear
    create: async (req, res) => {
      const { nom, permisos } = req.body;
      await Role.create({ nom, permisos });
      req.flash('success_msg', 'Rol creada correctament');
      res.redirect("/roles");
    },

    // Formulari d’edició
    editForm: async (req, res) => {
      const role = await Role.findById(req.params.id).lean();
      res.render("roles/edit", { title: "Editar Rol", role });
    },

    // Actualitzar
    update: async (req, res) => {
      const { nom, permisos } = req.body;
      const role = await Role.findById(req.params.id);
      role.nom = nom;
      role.permisos = permisos;
      await role.save();
      req.flash('success_msg', 'Rol actualitzat correctament');
      res.redirect("/roles");
    },

    // Eliminar
    delete: async (req, res) => {
      await Role.findByIdAndDelete(req.params.id);
      req.flash('success_msg', 'Rol eliminat correctament');
      res.redirect("/roles");
    },
 }
 module.exports = RoleController;