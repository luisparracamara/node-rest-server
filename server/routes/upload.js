const express = require("express");
//LIBRERIA PARA SUBIR ARCHIVOS
const fileUpload = require('express-fileupload');
let app = express();

const Usuario = require("../models/usuario");
const Producto = require("../models/producto");

//filesystem para borrar imagenes
const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "no se ha seleccionado ningun archivo"
            }
        });
    }


    //validar tipo
    let tiposValidos = ["productos","usuarios"]
    if (tiposValidos.indexOf(tipo) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "los tipos permitidos son: " + tiposValidos.join(', ')

            }
        })
    }



    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length -1];

    //console.log(extension);
    
    
    //Extensiones permitidas
    let extensionesValidas = ["png", "jpg", "gif", "jpeg"];

    if (extensionesValidas.indexOf(extension)<0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "las extensiones validas son " + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }


    //CAMBIAR NOMBRE AL ARCHIVO
    //luisfoto-123.jpg
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    
    
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //aqui la imagen está cargada

        //funcion para editar y guardar la imagen del usuario
      if (tipo === "usuarios") {
          imagenUsuario(id, res, nombreArchivo);
      }else{
          imagenProducto(id, res, nombreArchivo);
      }
        



        // res.json({
        //     ok: true,
        //     message: "archivo subido correctamente"
        // })
       
    });


});


function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, "usuarios");
            res.status(500).json({
                ok:false,
                err
            })
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, "usuarios");
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: "usuario no existe"
                    }
                })
        }

        //funcion para borrar repetido
        borraArchivo(usuarioDB.img, "usuarios");

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });


    })
}


function imagenProducto(id, res, nombreArchivo){


    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, "productos");
            res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, "productos");
            return res.status(400).json({
                ok: false,
                err: {
                    message: "producto no existe"
                }
            })
        }

        //funcion para borrar repetido
        borraArchivo(productoDB.img, "productos");

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });


    })


}

function borraArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    
    //saber si existe un archivo
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    } 

    
    
}

module.exports = app;