const express = require('express');
const router = express.Router();
const Modulo = require('../models/model'); 

router.get('/', async (req, res) => {
    try {
        const modulos = await Modulo.find();
        res.json(modulos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const modulo = new Modulo({
        imagen: req.body.imagen,
        titulo: req.body.titulo,
        temas: req.body.temas
    });

    try {
        const nuevoModulo = await modulo.save();
        res.status(201).json(nuevoModulo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const modulo = await Modulo.findById(req.params.id);
        if (modulo == null) {
            return res.status(404).json({ message: 'Módulo no encontrado' });
        }
        res.json(modulo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const modulo = await Modulo.findById(req.params.id);
        if (modulo == null) {
            return res.status(404).json({ message: 'Módulo no encontrado' });
        }
        if (req.body.imagen != null) {
            modulo.imagen = req.body.imagen;
        }
        if (req.body.titulo != null) {
            modulo.titulo = req.body.titulo;
        }
        if (req.body.temas != null) {
            modulo.temas = req.body.temas;
        }

        const moduloActualizado = await modulo.save();
        res.json(moduloActualizado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async(req, res)=>{
    try{
        const deleteModulo = await Modulo.findByIdAndDelete(req.params.id);
        res.status(200).json(deleteModulo); // Cambiado de 201 a 200
    } catch (error) {
        res.status(500).send(error.message)
    }
});

module.exports = router;
