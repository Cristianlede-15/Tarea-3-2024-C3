const Pokemon = require('../Models/Pokemon');
const Tipo = require('../Models/Tipo');
const Region = require('../Models/Region');
const { Op } = require('sequelize');

exports.listPokemones = async (req, res) => {
    try {
        const pokemones = await Pokemon.findAll({
            include: [Tipo, Region]
        });
        const regiones = await Region.findAll();
        res.render('Home/Home', { pokemones, regiones });
    } catch (error) {
        console.error('Error listing pokemones:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.searchPokemones = async (req, res) => {
    const { name, region } = req.query;
    const whereClause = {};

    if (name) {
        whereClause.nombre = {
            [Op.like]: `%${name}%`
        };
    }

    if (region) {
        whereClause.region_id = region;
    }

    try {
        const pokemones = await Pokemon.findAll({
            where: whereClause,
            include: [Tipo, Region]
        });
        const regiones = await Region.findAll();
        res.render('Home/Home', { pokemones, regiones });
    } catch (error) {
        console.error('Error searching pokemones:', error);
        res.status(500).send('Internal Server Error');
    }
};
