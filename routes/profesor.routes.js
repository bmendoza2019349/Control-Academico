const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { existenteEmail, existeUsuarioById, existeProfesorById} = require('../helpers/db-validators');

const { profesoresDelete, profesoresGet, profesoresPost, profesoresPut, getProfesorByid} = require('../controllers/profesor.controller');

const router = Router();

router.get("/", profesoresGet);

router.get(
    "/:id",
    [
        check("id","El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeProfesorById),
        validarCampos
    ], getProfesorByid);

router.put(
    "/:id",
    [
        check("id","El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeProfesorById),
        check("role", "El role no existe en la base de datos."),
        validarCampos
    ], profesoresPut);

router.delete(
    "/:id",
    [
        check("id","El id no es un formato válido de MongoDB").isMongoId(),
        check("id").custom(existeProfesorById),
        validarCampos
    ],profesoresDelete);

router.post(
    "/",
    [
        check("nombre","El nombre es obligatorio").not().isEmpty(),
        check("password","El password debe ser mayor a 6 caracteres").isLength({min: 6,}),
        check("correo","Este no es un correo válido").isEmail(),
        check("correo").custom(existenteEmail),
        check("role", "El rol solo puede ser actualizado no ingresado"),
        validarCampos,
    ], profesoresPost);

module.exports = router;