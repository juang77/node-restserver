const express = require('express');
const Producto = require('../models/productos');
const { response } = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

//Create new Producto
//Regresa nueva Producto
//req.usuario._id
app.post('/producto', verificaToken, function(req, res) {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.status(201).json({
            ok: true,
            categoria: productoBD
        });

    });
});


//Actualizar Producto
app.put('/producto/:id', verificaToken, function(req, res) {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Producto no existe.'
                }
            });
        };

        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.descripcion = body.descripcion;
        productoBD.disponible = body.disponible;
        productoBD.categoria = body.categoria;

        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            res.status(201).json({
                ok: true,
                producto: productoGuardado
            });

        });
    });


});

//Eliminar Producto - Solo Admin - Eliminado Fisico
//Eliminado Fisico de la Base de Datos
app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    };

    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado.'
                }
            });
        }

        productoBD.disponible = false;

        productoBD.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            res.status(201).json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto Borrado'
            });

        });
    });
});


//Get All Categories
app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments((err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });
        });
});

//Get one Specific Category.
app.get('/producto/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe el producto.'
                    }
                });
            }

            return res.json({
                ok: true,
                productos,
            });

        });
});

//Buscar Producto
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        });

});

module.exports = app;