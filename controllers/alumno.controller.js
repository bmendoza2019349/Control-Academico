const { response, json } = require('express');
const bcrypt = require('bcrypt');
const Alumno = require('../models/alumnos');
const { existenteAlumnoEmail, validarNumCursos, validarCursosRepetidos, validarExistenciaCursos } = require('../helpers/db-validators');
const Curso = require('../models/curso');

const alumnosPost = async (req, res) => {
    try {
        const { nombre, correo, password, cursos } = req.body;

        // Validar si el correo del alumno ya está registrado
        await existenteAlumnoEmail(correo);

        // Validar que no se estén agregando cursos repetidos
        validarCursosRepetidos(cursos);

        // Validar que no se exceda el número máximo de cursos permitidos
        validarNumCursos(cursos);

        // Validar que todos los cursos existan en la base de datos
        await validarExistenciaCursos(cursos);

        const hashedPassword = await bcrypt.hash(password, 10);

        const alumno = new Alumno({ nombre, correo, password: hashedPassword, cursos });

        await alumno.save();
        
        res.status(200).json({
            msg: 'Alumno Agregado Exitosamente',
            alumno
        });
    } catch (error) {
        res.status(409).json({
            error: error.message,
        });
    }
}

const getAlumnoByid = async (req, res) => {
    const { id } = req.params;
    const alumno = await Alumno.findOne({ _id: id });

    res.status(200).json({
        msg: 'Alumno Encontrado Exitosamente',
        alumno
    });
}

const alumnosGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, alumnos] = await Promise.all([
        Alumno.countDocuments(query),
        Alumno.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        alumnos
    });
}

const alumnosPut = async (req, res) => {
    const { id } = req.params;
    const { _id, password, google, correo, office, ...resto } = req.body;

    await Alumno.findByIdAndUpdate(id, resto);

    const alumno = await Alumno.findOne({ _id: id });

    res.status(200).json({
        msg: 'Alumno actualizado exitosamente',
        alumno
    });
}

const alumnosDelete = async (req, res) => {
    try {
        const { id } = req.params;
        await Alumno.findByIdAndUpdate(id, { estado: false });

        const alumno = await Alumno.findOne({ _id: id });

        res.status(200).json({
            msg: 'Alumno eliminado Exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: "Alumno no se elimino"
        });
    }
}

module.exports = {
    alumnosPost,
    alumnosDelete,
    alumnosGet,
    alumnosPut,
    getAlumnoByid
}