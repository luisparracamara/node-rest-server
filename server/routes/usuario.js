const express = require('express');
const app = express();

const bcrypt = require("bcrypt");

//SRIVE PARA LOS ARREGLOS, UNDERSCORE.JS
const _ = require("underscore");

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRol } = require("../middlewares/autentificacion");


app.get('/', function (req, res) {
    res.json('Hello World')
});

//TODO CON LA DOCUMENTACION DE MONGOOSE
//funcion con el middleware integrado
app.get("/usuario", verificaToken, (req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // })

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limit || 5;
    limite = Number(limite);
    
    Usuario.find({ estado:true },'nombre email role estado google imagen')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.count({ estado: true }, (err,conteo) => {

                    res.json({
                        ok: true,
                        usuarios,
                        cuantos:conteo
                    })

                });

               
            })
});



app.post("/usuario", [verificaToken, verificaAdminRol], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err,usuarioDB) =>{
        if (err) {
          return  res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
  
});



app.put("/usuario/:id", [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','img','role','estado'] );

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
 
});

app.delete("/usuario/:id", [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    //borrar fisicamente
    //Usuario.findByIdAndRemove(id, (err,usuarioBorrado) => {

    //solo actualizar el estado
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {    
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: "usuario no encontrado"
                }
            });
        }

 
        

        

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    });
});

module.exports =  app;

