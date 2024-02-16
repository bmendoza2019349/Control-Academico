const jwt = require('jsonwebtoken');
const profesor = require('../models/profesor');
const alumno = require('../models/alumnos');

const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg: 'No hay token'
        })
    }

    try {
        let user, userType;
        if (alumno) {
            user = alumno;
            userType = 'alumno'
        } else {
            user = profesor;
            userType = 'profesor';
        }
        //verificación de token
        const  { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid); // se debe colocar para recibir id
        //verificar que el usuario exista.
        if(!usuario){
            return res.status(400).json({
                msg: 'El usuario no existe'
            });
        }
        //verificar si el uid está habilidato.
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token valido, usuario con estado false'
            })
        }

        req.usuario= usuario;

        next();

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            msg: 'Token no valido'
        })

    }
}

module.exports = {
    validarJWT
}