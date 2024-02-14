const { response, json } = require('express');
const Curso = require('../models/curso');

const { existeCursosNombre, validarExistenciaProfesor } = require('../helpers/db-validators');

const cursosPost = async (req, res) => {
    try {
        const { nombre, detalle, acceso, profesor } = req.body;
        const nombreNormalizado = nombre.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
        await existeCursosNombre(nombreNormalizado);
        await validarExistenciaProfesor(profesor);
        const curso = new Curso({ nombre, detalle, acceso, profesor });

        await curso.save();
        res.status(200).json({
            msg: "Curso Agregado Con éxito",
            curso
        });
    } catch (error) {
        res.status(409).json({
            error: error.message,
        });
    }
}

const cursosGet = async (req, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: "Habilitado" };
    const [total, cursos] = await Promise.all([
        Curso.countDocuments(query),
        Curso.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        cursos
    });
}

const getCursoByid = async (req, res) => {
    const { id } = req.params;
    const curso = await Curso.findOne({ _id: id });

    res.status(200).json({
        curso
    });
}


const cursosPut = async (req, res) => {
    const { id } = req.params;
    const { _id, acceso, profesor, ...resto } = req.body;

    await Curso.findByIdAndUpdate(id, resto);
    const curso = await Curso.findOne({ _id: id });

    res.status(200).json({
        msg: 'Curso actualizado exitosamente',
        curso
    });
}

const cursosDelete = async (req, res) => {
    try {
        const { id } = req.params;
        await Curso.findByIdAndUpdate(id, { estado: false });

        const curso = await Curso.findOne({ _id: id });

        res.status(200).json({
            msg: 'Curso eliminado exitosamente',
        });
    } catch (error) {
        res.status(500).json({
            msg: "Curso no se elimino"
        });
    }
}

module.exports = {
    cursosDelete,
    cursosGet,
    cursosPost,
    cursosPut,
    getCursoByid
}