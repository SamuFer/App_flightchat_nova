const Incidence = require('../models/Incidents');

const IncidenceController = {
    list: async (req, res) => {
        const incidencies = await Incidence.find().sort({ createdAt: -1 });
        console.log(incidencies)
        res.render('incidents/list', { incidencies });
    },
    show: async (req, res) => {
        try {
        const incidencies = await Incidence.findById(req.params.id).lean();
        res.render('incidents/show', { incidencies });
        } catch (error) {
        console.error(error);
        res.redirect('/incidents');
        }
    },
    delete: async (req, res) => {
        try {
        await Incidence.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'peticio d-incidencia eliminat correctament');
        res.redirect('/incidents');
        } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error eliminant peticio d-incidencia');
        res.redirect('/incidents');
        }
    },
    review: async (req, res) => {
    try {
        const { id } = req.params;
        const { novaEstat } = req.body;

        const incidencia = await Incidence.findById(id);
        if (!incidencia) {
        req.flash('error_msg', 'Incidència no trobada.');
        return res.redirect('/incidencies');
        }

        incidencia.estat = novaEstat;
        await incidencia.save();

        if (novaEstat === 'acceptada') {
        req.flash('success_msg', 'Incidència acceptada. Redirigint a la creació de comanda.');
        return res.redirect(`/orders/create?fromIncidencia=${id}`);
        }

        req.flash('success_msg', 'Incidència revisada correctament.');
        res.redirect('/incidents');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error en revisar la incidència.');
        res.redirect('/incidents');
    }
    }

};

module.exports = IncidenceController;
