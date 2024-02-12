// const Alumno = require('../models/alumnos');
const Profesor = require('../models/profesor');


const existenteEmail = async (correo = '') => {
    const existeEmail = await Profesor.findOne({correo});
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
const existeProfesorById = async ( id = '') => {
    const existeUsuario = await Profesor.findOne({id});
    if(!existeUsuario){
        throw new Error(`El usuario con el ${ id } no existe`);
    }
}



module.exports = {
    existenteEmail,
    existeUsuarioById,
    existeProfesorById
}

