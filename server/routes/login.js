const express = require('express');
const app = express();

//para encriptar el password
const bcrypt = require("bcrypt");
//para acceder a la tabla usuario
const Usuario = require('../models/usuario');

//para el token
var jwt = require('jsonwebtoken');


app.post("/login", (req, res) => {

    let body = req.body;

    Usuario.findOne({ email:body.email }, (err,usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "USUARIO o contraseña incorrectos"
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "usuario o CONTRASEÑA incorrectos"
                }
            });
        }


        //SE CREA EL TOKEN CON LOS VALORES QUE HAY EN CONFIG CON LA DOCUMENTACION DE JWT
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    });
});



module.exports = app;