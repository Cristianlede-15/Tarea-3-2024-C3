const { Op } = require('sequelize');
const Region = require('../Models/Region');

exports.listRegions = async (req, res) => {
    try {
        const regiones = await Region.findAll();
        res.render('regiones/MantenimientoRegiones', { regiones });
    } catch (error) {
        console.error('Error listing regions:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.showCreateForm = (req, res) => {
    res.render('regiones/FormRegiones', { region: null });
};

exports.createRegion = async (req, res) => {
    try {
        const newRegion = await Region.create(req.body);
        res.redirect('/regiones');
    } catch (error) {
        console.error('Error creating region:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const region = await Region.findByPk(req.params.id);
        if (region) {
            res.render('regiones/FormRegiones', { region });
        } else {
            res.status(404).send('Region not found');
        }
    } catch (error) {
        console.error('Error showing edit form:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateRegion = async (req, res) => {
    try {
        await Region.update(req.body, {
            where: { id: req.params.id }
        });
        res.redirect('/regiones');
    } catch (error) {
        console.error('Error updating region:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteRegion = async (req, res) => {
    try {
        await Region.destroy({
            where: { id: req.params.id }
        });
        res.redirect('/regiones');
    } catch (error) {
        console.error('Error deleting region:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.searchRegions = async (req, res) => {
    try {
        const { name, region } = req.query;
        const whereClause = {};

        if (name) {
            whereClause.nombre = {
                [Op.like]: `%${name}%`
            };
        }

        if (region) {
            whereClause.id = region;
        }

        const regiones = await Region.findAll({
            where: whereClause
        });

        res.render('regiones/MantenimientoRegiones', { regiones });
    } catch (error) {
        console.error('Error searching regions:', error);
        res.status(500).send('Internal Server Error');
    }
};
