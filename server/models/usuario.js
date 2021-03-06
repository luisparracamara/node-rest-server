const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


let rolesValidos = {
    values: ["ADMIN_ROLE","USER_ROLE"],
    message: " {VALUE} No es un rol válido"
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    email: {
        type: String,
        required: [true, "El correo es necesario"],
        unique:true
    },
    password:{
        type: String,
        required: [true, "password obligatorio"]
    },
    img:{
        type: String,
        required: false
    },
    role:{
        type: String,
        default: "USER_ROLE",
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }

});


//ESTO ES PARA NO MOSTRAR LA CONTRASEÑA EN EL JSON Y QUE NO LA PUEDAN VER PARA DESENCRIPTAR
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


usuarioSchema.plugin(uniqueValidator, {
    message: ' {PATH} debe de ser unico '
});

module.exports = mongoose.model("Usuario", usuarioSchema);