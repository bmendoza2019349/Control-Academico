const { Schema, model } = require('mongoose');

const AlumnoSchema = Schema ({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        enum: ["TEACHER_ROLE", "STUDENT_ROLE"],
        default: "STUDENT_ROLE"
    },
    estado: {
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    },
    office:{
        type: Boolean,
        default: false
    },
    cursos: [
        {
            type: Schema.Types.ObjectId,
            ref:'Curso'
        }
    ]
});

module.exports = model('Alumno', AlumnoSchema)