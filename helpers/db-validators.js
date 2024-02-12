const Alumno = require('../models/alumnos');

const existenteEmail = async (correo = '') => {
    const existeEmail = await Alumno.findOne({correo});
    if(existeEmail){
        throw new Error(`El email ${ correo } ya fue registrado`)
    }
}

const existeUsuarioById = async ( id = '') => {
    const existeUsuario = await Alumno.findOne({id});
    if(!existeUsuario){
        throw new Error(`El usuario con el ${ id } no existe`);
    }
}

module.exports = {
    existenteEmail,
    existeUsuarioById
}

