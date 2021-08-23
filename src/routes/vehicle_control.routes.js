const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth.jwt");
const { check } = require("express-validator");
const { postVehicleControl, getVehicleControl, searchVehicleControlByPlaca }
    = require("../controllers/vehicle_control.controller")
const { validateFields } = require("../middlewares/validate_fields")
const router = Router();

router.get('/', [verifyToken], getVehicleControl);

router.post("/", [
    check("number_km_output", "El kilometraje es obligatorio").not().isEmpty(),
    check("img_url_km_output", "La imagen del kilometraje es obligatorio").not().isEmpty(),
    check("id_user_bodega", "El usuario es obligatorio").not().isEmpty(),
    check("id_vehicle", "El id del vehiculo es obligatorio").not().isEmpty(),
    check("id_user_bodega", "No es un ID válido").isMongoId(),
    check("id_vehicle", "No es un ID válido").isMongoId(),
    validateFields, verifyToken
], postVehicleControl)

router.get('/search/:placa', [check("placa", "La placa es obligatorio").not().isEmpty(),
    validateFields, verifyToken,
], searchVehicleControlByPlaca);

module.exports = router;