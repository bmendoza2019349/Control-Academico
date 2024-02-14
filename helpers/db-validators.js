const Alumno = require('../models/alumnos');
const Profesor = require('../models/profesor');
const Curso = require('../models/curso');

const existenteProfesorEmail = async (correo = '') => {
    const existeEmail = await Profesor.findOne({correo});
    if(existeEmail){
        throw new Error(`El email ${ correo } ya fue registrado`)
    }
}

const existeCursosNombre = async (nombre='')=>{
    const existeNombre = await Curso.findOne({nombre});
    if(existeNombre){
        throw new Error(`El Curso ${ nombre } ya fue registrado`)
    }
}

const existenteAlumnoEmail = async (correo = '') => {
    const existeEmail = await Profesor.findOne({correo});
    if(existeEmail){
        throw new Error(`El email ${ correo } ya fue registrado`)
    }
}

const existeAlumnoById = async ( id = '') => {
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

const existeCursoById = async ( id = '') => {
    const existeUsuario = await Curso.findOne({id});
    if(!existeUsuario){
        throw new Error(`El curso con el ${ id } no existe`);
    }
}



module.exports = {
    existeCursoById,
    existeProfesorById,
    existenteAlumnoEmail,
    existenteProfesorEmail,
    existeAlumnoById,
    existeCursosNombre
}

