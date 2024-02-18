const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { existenteEmail, existeUsuarioById, esRolValido, existeCursoById } = require('../helpers/db-validators');
const { cursosDelete, cursosGet, cursosPost, cursosPut, getCursoByid, cursosProfesorGet } = require('../controllers/cursos.controller');

const router = Router();

router.get("/", cursosGet);

router.get(
    "/:id",
    [
        check("id", "El id no es un formato valido de MongoDB").isMongoId(),
        check("id").custom(existeCursoById),
        validarCampos
    ], getCursoByid);


router.put(
    "/:id",
    [
        check("id", "El id no es un formato valido de MongoDB").isMongoId(),
        check("id").custom(existeCursoById),
        validarCampos
    ], cursosPut);

router.delete(
    "/:id",
    [
        check("id", "El id no es un formato valido de MongoDB").isMongoId(),
        check("id").custom(existeCursoById),
        validarCampos
    ], cursosDelete);

router.post(
    "/",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("detalle", "El detalle debe ser mayor a 10 caracteres").isLength({ min: 10, }),
        validarCampos
    ], cursosPost);


    router.post(
        "/profesor",
        [
            check("correo", "El correo del profesor es obligatorio").isEmail(),
            validarCampos
        ], cursosProfesorGet);

module.exports = router;
