const { response, json } = require('express');
const bcrypt = require('bcrypt');
const Alumno = require('../models/alumnos');
const { existenteAlumnoEmail } = require('../helpers/db-validators');
const Curso = require('../models/curso');

const alumnosPost = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;
        await existenteAlumnoEmail(correo);
        const hashedPassword = await bcrypt.hash(password, 10);
        const alumno = new Alumno({ nombre, correo, password: hashedPassword });
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
        
        const alumno = await Alumno.findByIdAndUpdate(id, { estado: false });
        res.status(200).json({
            msg: 'Alumno eliminado',
            alumno
        });
    } catch (error) {
        res.status(500).json({
            msg: "Alumno no se elimino"
        });
    }
}

const agregarCursoAlumno = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { nombreMateria } = req.body;

        const curso = await Curso.findOne({ nombre: nombreMateria });
        if (!curso) {
            return res.status(404).json({
                error: 'El curso no existe',
            });
        }
        const alumno = await Alumno.findById(id);
        if (alumno.cursos.includes(curso._id)) {
            return res.status(400).json({
                error: 'El alumno ya está inscrito en este curso',
            });
        }
        if (alumno.cursos.length >= 3) {
            return res.status(400).json({
                error: 'El alumno ya está inscrito en el máximo de cursos permitidos',
            });
        }
        alumno.cursos.push(curso._id);
        await alumno.save();

        res.status(200).json({
            msg: 'Curso agregado exitosamente al alumno',
            alumno,
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al agregar el curso al alumno',
            error: error.message,
        });
    }
};

const getCursosAlumnoById = async (req, res) => {
    try {
        const { id } = req.params;
        const alumno = await Alumno.findById(id);
        if (!alumno) {
            return res.status(404).json({
                error: 'Alumno no encontrado',
            });
        }

        // Modificación: Obtener los cursos y el nombre del curso
        const cursos = await Curso.find({ _id: { $in: alumno.cursos } });
        const cursosConNombre = cursos.map(curso => ({
            _id: curso._id,
            nombre: curso.nombre,
            detalle: curso.detalle,
            profesor: curso.profesor
        }));

        res.status(200).json({
            alumno,
            cursos: cursosConNombre
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener los cursos del alumno',
            error: error.message,
        });
    }
};

module.exports = {
    alumnosPost,
    alumnosDelete,
    alumnosGet,
    alumnosPut,
    getAlumnoByid,
    agregarCursoAlumno,
    getCursosAlumnoById
}