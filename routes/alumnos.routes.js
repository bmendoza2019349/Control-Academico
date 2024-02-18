const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { existenteAlumnoEmail, existeAlumnoById } = require('../helpers/db-validators');

const { alumnosPost, getAlumnoByid, alumnosPut, alumnosDelete, alumnosGet, agregarCursoAlumno, getCursosAlumnoById } = require('../controllers/alumno.controller');

const router = Router();

router.get("/", alumnosGet);

router.post(
    "/",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("password", "El password debe ser mayor a 6 caracteres").isLength({ min: 6, }),
        check("correo", "Este no es un correo válido").isEmail(),
        check("correo").custom(existenteAlumnoEmail),
        validarCampos,
    ], alumnosPost);

router.get(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeAlumnoById),
        validarCampos
    ], getAlumnoByid);

router.put(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeAlumnoById),
        validarCampos
    ], alumnosPut);

router.delete(
    "/:id",
    [
        check("id", "El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeAlumnoById),
        validarCampos
    ], alumnosDelete);


    router.post(
        "/:id",
        [
            check("nombreMateria", "El nombre de la materia es obligatorio").not().isEmpty(),
            validarCampos,
        ],
        agregarCursoAlumno
    );

    router.get(
        "/:id/cursos",
        [
            check("id", "El id no es un formato válido de MongoDB").isMongoId(),
            check("id").custom(existeAlumnoById),
            validarCampos,
        ],
        getCursosAlumnoById
    );

module.exports = router;
