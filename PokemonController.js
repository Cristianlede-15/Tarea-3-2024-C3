const Pokemon = require('../Models/Pokemon');
const Tipo = require('../Models/Tipo');
const Region = require('../Models/Region');
const { Op } = require('sequelize');

exports.listPokemones = async (req, res) => {
    try {
        const pokemones = await Pokemon.findAll({ include: [Tipo, Region] });
        const regiones = await Region.findAll();
        res.render('Pokemon/MantenimientoPokemones', { pokemones, regiones });
    } catch (error) {
        console.error('Error al obtener los pokemones:', error);
        res.status(500).send('Error al obtener los pokemones');
    }
};

exports.newPokemonForm = async (req, res) => {
    try {
        const tipos = await Tipo.findAll();
        const regiones = await Region.findAll();
        res.render('Pokemon/FormPokemones', { tipos, regiones, pokemon: null });
    } catch (error) {
        console.error('Error al obtener los datos para el formulario:', error);
        res.status(500).send('Error al obtener los datos para el formulario');
    }
};


exports.createPokemon = async (req, res) => {
    try {
        const { nombre, url_imagen, tipo, region } = req.body;

        if (!tipo || !region) {
            return res.status(400).send('Tipo y Región son requeridos');
        }

        const tipoObj = await Tipo.findOne({ where: { id: tipo } });
        if (!tipoObj) {
            return res.status(400).send(`Tipo no encontrado: ${tipo}`);
        }

        const regionObj = await Region.findOne({ where: { id: region } });
        if (!regionObj) {
            return res.status(400).send(`Región no encontrada: ${region}`);
        }

        const newPokemon = await Pokemon.create({
            nombre: nombre,
            url_imagen: url_imagen,
            tipo_id: tipoObj.id,
            region_id: regionObj.id
        });

        res.redirect('/pokemones');
    } catch (error) {
        console.error('Error creating pokemon:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.editPokemonForm = async (req, res) => {
    try {
        const pokemon = await Pokemon.findByPk(req.params.id);
        const tipos = await Tipo.findAll();
        const regiones = await Region.findAll();
        if (!pokemon) {
            return res.status(404).send('Pokemon not found');
        }
        res.render('Pokemon/FormPokemones', { title: 'Editar Pokemon', pokemon, tipos, regiones });
    } catch (error) {
        console.error('Error fetching pokemon:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updatePokemon = async (req, res) => {
    try {
        await Pokemon.update(req.body, {
            where: { id: req.params.id }
        });
        res.redirect('/pokemones');
    } catch (error) {
        console.error('Error updating pokemon:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deletePokemon = async (req, res) => {
    try {
        await Pokemon.destroy({
            where: { id: req.params.id }
        });
        res.redirect('/pokemones');
    } catch (error) {
        console.error('Error deleting pokemon:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.searchPokemones = async (req, res) => {
    const { name } = req.query;
    try {
        const pokemones = await Pokemon.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            }
        });
        res.render('Pokemon/index', { title: 'Resultados de Búsqueda', pokemones });
    } catch (error) {
        console.error('Error searching pokemones:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.getPokemonDetails = async (req, res) => {
    try {
        const pokemonId = req.params.id;
        const pokemon = await Pokemon.findByPk(pokemonId, {
            include: ['Tipo', 'Region']
        });
        if (pokemon) {
            res.render('Pokemon/DetailsPokemon', { pokemon });
        } else {
            res.status(404).send('Pokémon no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
};
