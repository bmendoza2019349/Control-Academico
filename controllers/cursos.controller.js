const { response, json } = require('express');
const Curso = require('../models/curso');
//const Profesor = require('../models/profesor');

const cursosPost = async (req, res) => {
    const { nombre, detalle, acceso, profesor } = req.body;
    const curso = new Curso({ nombre, detalle, acceso, profesor });
    // try {
    //     const profesor = await Profesor.findOne({ correo: profesorCorreo });
    //     if (!profesor) {
    //         return res.status(404).json({ mensaje: 'Profesor no encontrado' });
    //     }
    //     const curso = new Curso({ nombre, detalle, acceso, profesor });
    //     await curso.save();
    //     res.status(200).json({
    //         curso
    //     });
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
    await curso.save();
    res.status(200).json({
        curso
    });
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
    const { id } = req.params;
    await Curso.findByIdAndUpdate(id, { estado: false });

    const curso = await Curso.findOne({ _id: id });

    res.status(200).json({
        msg: 'Curso eliminado exitosamente',
    });
}

module.exports = {
    cursosDelete,
    cursosGet,
    cursosPost,
    cursosPut,
    getCursoByid
}