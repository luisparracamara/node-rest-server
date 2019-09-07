const express = require("express");

const fs = require("fs");
const path = require("path");

const {verificaTokenImg} = require('../middlewares/autentificacion');

let app  = express();

app.get("/imagen/:tipo/:img",verificaTokenImg, (req,res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    //si esxiste el archivo en la direccion
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    }else{
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }

})

module.exports = app;