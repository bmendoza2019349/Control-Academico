const jwt = require('jsonwebtoken');
const Alumno = require('../models/alumnos');
const Profesor = require('../models/profesor');

const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg: 'No hay token'
        })
    }

    try {
        //verificación de token
        const  { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //leer el usuario que corresponde al uid
        const alumno = await Alumno.findById(uid);
        const profesor = await Profesor.findById(uid); // se debe colocar para recibir id
        //verificar que el usuario exista.
        if(!alumno && !profesor){
            return res.status(400).json({
                msg: 'El usuario no existe'
            });
        }
        //verificar si el uid está habilidato.
        if(!profesor.estado){
            return res.status(401).json({
                msg: 'Token valido, usuario con estado false'
            })
        }else{
            return res.status(401).json({
                msg: 'Token valido, usuario con estado false'
            })
        }

        if(alumno){
            req.alumno= alumno;
        }else{
            req.profesor= profesor;
        }
        

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