const { response, json } = require('express');
const bcrypt = require('bcrypt');
const Alumno = require('../models/alumnos');
const { existenteAlumnoEmail } = require('../helpers/db-validators');
//const Curso = require('./models/curso');

const alumnosPost = async (req, res) => {
    try {
        const { nombre, correo, password, cursos } = req.body;
        await existenteAlumnoEmail(correo);
        const hashedPassword = await bcrypt.hash(password, 10);
        const alumno = new Alumno({ nombre, correo, password: hashedPassword, cursos/*: cursosEncontrados.map(curso => curso._id)*/ });

        //const cursosEncontrados = await Curso.find({ nombre: { $in: cursos } });
        // if (cursos.length !== cursosEncontrados.length) {
        //     const cursosNoEncontrados = cursos.filter(curso => !cursosEncontrados.some(c => c.nombre === curso));
        //     return res.status(404).json({ mensaje: `No se encontraron los cursos: ${cursosNoEncontrados.join(', ')}` });
        // }

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