const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth.jwt");
const { check } = require("express-validator");
const { getSelectUserVehicleStatusActiveTrue, getSelectUserVehicleStatusActiveFalse,
    postSelectUserVehicle, updateSelectUserVehicleDeliveryVehicle } =
    require("../controllers/select_user_vehicle.controller")
const { validateFields } = require("../middlewares/validate_fields")
const { verifySelectUserVehicle } = require("../middlewares/validate_select_user_vehicle")
const router = Router();

router.get("/status-active-false/:userAgent", [
    check("userAgent", "La agente de supermercado es obligatorio").not().isEmpty(),
    check("userAgent", "No es un ID válido").isMongoId(),
    validateFields, verifyToken], getSelectUserVehicleStatusActiveFalse);

router.get("/status-active-true/:userAgent", [
    check("userAgent", "La agente de supermercado es obligatorio").not().isEmpty(),
    check("userAgent", "No es un ID válido").isMongoId(),
    validateFields, verifyToken], getSelectUserVehicleStatusActiveTrue);

router.post("/", [
    check("number_km_output", "La cantidad de km es obligatorio").not().isEmpty(),
    check("img_url_km_output", "La imagen de los km es obligatorio").not().isEmpty(),
    check("date_output", "La fecha de salida es obligatorio").not().isEmpty(),
    check("number_day", "La dia es obligatorio").not().isEmpty(),
    check("observation_output", "La observacion de salida es obligatorio").not().isEmpty(),
    check("id_user_agent", "El usuario agente es obligatorio").not().isEmpty(),
    check("id_user_auxiliar", "El usuario auxiliar es obligatorio").not().isEmpty(),
    check("id_vehicle", "El id del vehiculo es obligatorio").not().isEmpty(),
    check("id_user_agent", "No es un ID válido").isMongoId(),
    check("id_user_auxiliar", "No es un ID válido").isMongoId(),
    check("id_vehicle", "No es un ID válido").isMongoId(),
    validateFields, verifyToken, verifySelectUserVehicle
], postSelectUserVehicle);

router.put("/:selectUserVehicleId", [
    check("selectUserVehicleId", "El id de la seleccion de usuario es obligatorio").not().isEmpty(),
    check("number_km_return", "El numero de km de retorno es obligatorio").not().isEmpty(),
    check("img_url_km_return", "El numero de km es obligatorio").not().isEmpty(),
    check("date_return", "El fecha de retorno es obligatorio").not().isEmpty(),
    check("observation_return", "La observacion de entrada es obligatorio").not().isEmpty(),
    check("selectUserVehicleId", "No es un ID válido").isMongoId(),
    validateFields, verifyToken], updateSelectUserVehicleDeliveryVehicle);

module.exports = router;