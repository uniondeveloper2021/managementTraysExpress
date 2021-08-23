const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth.jwt");
const { check } = require("express-validator");
const { getAllTechnicalSupportGeneralIsAnsweredTrue,
    getAllTechnicalSupportGeneralIsAnsweredFalse,
    getAllTechnicalSupportGeneralByUserIsAnsweredTrue,
    getAllTechnicalSupportGeneralByUserIsAnsweredFalse,
    addTechnicalSupport, replyTechnicalSupport }
    = require("../controllers/technical.support.controller")
const { validateFields } = require("../middlewares/validate_fields")
const router = Router();

router.get('/is-anwered-true', [verifyToken],
    getAllTechnicalSupportGeneralIsAnsweredTrue);

router.get('/is-anwered-false', [verifyToken],
    getAllTechnicalSupportGeneralIsAnsweredFalse);

router.get('/is-anwered-true/:id_user', [check("id_user", "El id es obligatorio").not().isEmpty(),
check("id_user", "No es un ID válido").isMongoId(), validateFields, verifyToken],
    getAllTechnicalSupportGeneralByUserIsAnsweredTrue);

router.get('/is-anwered-false/:id_user', [check("id_user", "El id es obligatorio").not().isEmpty(),
check("id_user", "No es un ID válido").isMongoId(), validateFields, verifyToken],
    getAllTechnicalSupportGeneralByUserIsAnsweredFalse);

router.post('/',
    [check("title", "El titulo es obligatorio").not().isEmpty(),
    check("description", "La descripcion es obligatorio").not().isEmpty(),
    check("url_img", "El imagen es obligatorio").not().isEmpty(),
    check("date", "El fecha es obligatorio").not().isEmpty(),
    check("id_user", "La id del usuario es obligatorio").not().isEmpty(),
    check("id_user", "No es un ID válido").isMongoId(),
        validateFields, verifyToken],
    addTechnicalSupport);

router.put('/:id_technical', [check("id_technical", "El id es obligatorio").not().isEmpty(),
check("answer", "El respuesta es obligatorio").not().isEmpty(),
check("id_technical", "No es un ID válido").isMongoId(), validateFields, verifyToken],
    replyTechnicalSupport);

module.exports = router;