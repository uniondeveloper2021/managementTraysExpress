const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth.jwt");
const { check } = require("express-validator");
const { getEstablishment, updateEstablishmentStatusFreeToFalse, postEstablishment,
    updateEstablishmentById, deleteEstablishmentById, searchEstablishmentByName,
    updateEstablishmentByIdStatusInDeliveryToFalse }
    = require("../controllers/establishment.controller")
const { validateFields } = require("../middlewares/validate_fields")
const router = Router();

router.get('/', [verifyToken], getEstablishment);

router.post("/",
    [check("name", "El nombre es obligatorio").not().isEmpty(),
    check("direction", "La direccion es obligatorio").not().isEmpty(),
    check("ean", "El EAN es obligatorio").not().isEmpty(),
    check("reception_hours", "El horario de recepcion es obligatorio").not().isEmpty(),
    check("cant_trays", "La cantidad de charolas es obligatorio").not().isEmpty(),
        validateFields, verifyToken
    ], postEstablishment)

router.get('/search/:name', [check("name", "El nombre obligatorio").not().isEmpty(),
    validateFields, verifyToken,
], searchEstablishmentByName);

router.put("/status-free/:establishmentId", [check("establishmentId", "El id es obligatorio").not().isEmpty(),
check("establishmentId", "No es un ID válido").isMongoId(), validateFields, verifyToken,
], updateEstablishmentStatusFreeToFalse);

router.put("/status-is-delivery/:establishmentId", [check("establishmentId", "El id es obligatorio").not().isEmpty(),
check("establishmentId", "No es un ID válido").isMongoId(), validateFields, verifyToken,
], updateEstablishmentByIdStatusInDeliveryToFalse);

router.put("/:establishmentId", [check("establishmentId", "El id es obligatorio").not().isEmpty(),
check("establishmentId", "No es un ID válido").isMongoId(), validateFields, verifyToken,
], updateEstablishmentById);

router.delete("/:establishmentId", [check("establishmentId", "El id es obligatorio").not().isEmpty(),
check("establishmentId", "No es un ID válido").isMongoId(), validateFields, verifyToken,
], deleteEstablishmentById);

module.exports = router;