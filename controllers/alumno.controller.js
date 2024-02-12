const { respose, json } = require('express');
const bcrypt = require('bcrypt');
const Alumno = require('../models/alumnos');

const alumnoPost = async (req, res) =>{
    const hashedPassword = await bcrypt.hash(password, 10);
    const { nombre ,correo, password, role } = req.body;
    const alumno = new Alumno({nombre ,correo, password: hashedPassword, role});

    await alumno.save();
    res.status(200).json({
        alumno
    });
}

const getAlumnoByid = async (req, res) => {
    const { id } = req.params;
    const alumno = await Alumno.findOne({_id: id});

    res.status(200).json({
        
    })
}