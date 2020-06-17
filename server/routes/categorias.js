const express = require('express');
const Categoria = require('../models/categoria');
const { response } = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

//Get All Categories
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .populate('usuario', 'nombre, email')
        .sort('descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });
            });
        });
});

//Get one Specific Category.
app.get('/categoria/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                message: 'No existe la categoria.'
            });
        };

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });

});



//Create new category
//Regresa nueva categoria
//req.usuario._id
app.post('/categoria', verificaToken, function(req, res) {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.status(201).json({
            ok: true,
            categoria: categoriaBD
        });

    });
});


//Actualizar Nombre de la Categoria
app.put('/categoria/:id', verificaToken, function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, useFindAndModify: false }, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });


});


//Eliminar Categoria - Solo Admin - Eliminado Fisico
//Eliminado Fisico de la Base de Datos
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, { useFindAndModify: false }, (err, categoriaBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada.'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada.'
        });
    });
});

module.exports = app;