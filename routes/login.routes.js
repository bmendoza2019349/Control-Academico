const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getUsuariosLogin } = require('../controllers/login.controller');

const router = Router();

router.post(
    "/",
    [
        check("correo", "este no es un correo válido").isEmail().not().isEmpty(),
        check("password", "El password es obligatorio").not().isEmpty(),
        validarCampos
    ],getUsuariosLogin);

    module.exports = router;