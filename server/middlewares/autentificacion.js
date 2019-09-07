const jwt = require("jsonwebtoken");
//===================
//VERIFICAR TOKEN
//===================

let verificaToken = (req,res,next) =>{
    let token = req.get('token');

    //verificar que el token exista
    jwt.verify(token, process.env.SEED, (err,decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err:{
                    message:"token no válido"
                }
            })
        }

        
        req.usuario = decoded.usuario;
        next();
    })
}


//===================
//VERIFICAR TOKEN
//===================

let verificaAdminRol = (req,res,next) =>{
    let usuario = req.usuario;

    if (usuario.role === "ADMIN_ROLE") {
        next();
    }else{
        return res.json({
            ok: false,
            err:{
                message: "El usuario no es administrador"
            }
        })
    }

}


//===================
//VERIFICAR TOKEN IMG
//===================

let verificaTokenImg = (req,res,next) => {
    let token = req.query.token;
    

    //verificar que el token exista
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "token no válido"
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    });

}







module.exports = {
    verificaToken,
    verificaAdminRol,
    verificaTokenImg
}