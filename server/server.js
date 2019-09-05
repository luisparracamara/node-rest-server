require("./config/config.js");

const express = require('express');
const mongoose = require('mongoose');
const app = express();

//para poder utilizar un html como index
const path = require('path');



const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());


//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname,'../public')));


//configuracion global de rutas
app.use(require("./routes/index"));


mongoose.connect(process.env.urlDB, { useNewUrlParser: true }, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log("Base de datos online");
    }
});

app.listen(process.env.PORT, () => {
    console.log("escuchando en puerto ", 3000);

})


