const { response } = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Profesor = require('../models/profesor');
const Alumno = require('../models/alumnos');

const getUsuariosLogin = async (req, res) => {
    const { correo, password } = req.body;
    const alumno = await Alumno.findOne({ correo });
    const profesor = await Profesor.findOne({ correo });

    if (!alumno && !profesor) {
        res.status(401).json({
            msg: 'Correo Incorrecto, No existe en la base de datos'
        });
    } else {
        let user, userType;
        if (alumno) {
            user = alumno;
            userType = 'alumno'
        } else {
            user = profesor;
            userType = 'profesor';
        }
        const validacioPassword = bcrypt.compareSync(password, user.password);
        if (!validacioPassword) {
            res.status(200).json({
                msg: 'Contraseña Incorrecta'
            });
        } else {
            res.status(200).json({
                msg: 'Credenciales Validas',
                user
            });
        }
    }
}

module.exports = {
    getUsuariosLogin
}