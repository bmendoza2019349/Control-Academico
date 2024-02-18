const { response, json } = require('express');
const Curso = require('../models/curso');
const Profesor = require('../models/profesor');
const Alumno = require('../models/alumnos');
const { existeCursosNombre, validarExistenciaProfesor } = require('../helpers/db-validators');

const cursosPost = async (req, res) => {
    try {
        const { nombre, detalle, acceso, profesor } = req.body;
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
    try {
        const { id } = req.params;
        const { _id, acceso, profesor, ...resto } = req.body;

        // Modificación: Actualizar el curso
        const curso = await Curso.findByIdAndUpdate(id, resto, { new: true });

        // Modificación: Actualizar los cursos en los alumnos
        await Alumno.updateMany(
            { cursos: { $in: [curso._id] } },
            { $set: { "cursos.$": curso._id } }
        );

        res.status(200).json({
            msg: 'Curso actualizado exitosamente',
            curso
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error al actualizar el curso",
            error: error.message
        });
    }
}

const cursosDelete = async (req, res) => {
    try {
        const { id } = req.params;

        const curso = await Curso.findById(id);
        if (!curso) {
            return res.status(404).json({
                msg: 'El curso no existe',
            });
        }

        // Actualizar alumnos eliminando el curso
        await Alumno.updateMany(
            { cursos: curso._id },
            { $pull: { cursos: curso._id } }
        );

        // Después de actualizar los alumnos, puedes eliminar el curso
        await Curso.findByIdAndUpdate(id, { estado: false });

        res.status(200).json({
            msg: 'Curso eliminado exitosamente',
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al eliminar el curso',
            error: error.message,
        });
    }
};


const cursosProfesorGet = async (req, res) => {
    try {
        const { correo } = req.body;

        // Obtener cursos asociados al profesor
        const cursos = await Curso.find({ profesor: correo });

        res.status(200).json({
            total: cursos.length,
            cursos
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error al obtener cursos del profesor",
            error: error.message
        });
    }
}

module.exports = {
    cursosDelete,
    cursosGet,
    cursosPost,
    cursosPut,
    getCursoByid,
    cursosProfesorGet
}