const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth.jwt");
const { check } = require("express-validator");
const { getDeliveryTraysEstablishmentByIdUser, getDeliveryTraysEstablishment,
    postDeliveryTraysEstabl }
    = require("../controllers/delivery_trays_establishment.controller")
const { validateFields } = require("../middlewares/validate_fields")
const { verifyDeliveryTraysEstablishment, verifyDeliveryTraysEstablishmentSunday }
    = require("../middlewares/validate_delivery_trays_establ.js")
const router = Router();

router.get('/', [verifyToken], getDeliveryTraysEstablishment)

router.get('/:userId', [
    check("userId", "El usuario es obligatorio").not().isEmpty(),
    check("userId", "No es un ID válido").isMongoId(),
    validateFields, verifyToken], getDeliveryTraysEstablishmentByIdUser)

router.post("/", [
    check("trays_delivered", "Cantiad de charolas es obligatorio").not().isEmpty(),
    check("date", "La fecha es obligatorio").not().isEmpty(),
    check("collected_trays", "El id de agente es obligatorio").not().isEmpty(),
    check("observation", "La observacion es obligatorio").not().isEmpty(),
    check("id_user_agent", "El id de agente es obligatorio").not().isEmpty(),
    check("id_establishment", "El id es obligatorio").not().isEmpty(),
    check("id_incident", "El id es obligatorio").not().isEmpty(),
    check("number_day", "El dia es obligatorio").not().isEmpty(),
    check("id_user_agent", "No es un ID válido").isMongoId(),
    check("id_establishment", "No es un ID válido").isMongoId(),
    check("id_incident", "No es un ID válido").isMongoId(),
    validateFields, verifyToken, verifyDeliveryTraysEstablishment],
    postDeliveryTraysEstabl)

router.post("/sunday", [
    check("trays_delivered", "Cantiad de charolas es obligatorio").not().isEmpty(),
    check("date", "La fecha es obligatorio").not().isEmpty(),
    check("collected_trays", "El id de agente es obligatorio").not().isEmpty(),
    check("observation", "La observacion es obligatorio").not().isEmpty(),
    check("id_user_agent", "El id de agente es obligatorio").not().isEmpty(),
    check("id_establishment", "El id es obligatorio").not().isEmpty(),
    check("id_incident", "El id es obligatorio").not().isEmpty(),
    check("number_day", "El dia es obligatorio").not().isEmpty(),
    check("id_user_agent", "No es un ID válido").isMongoId(),
    check("id_establishment", "No es un ID válido").isMongoId(),
    check("id_incident", "No es un ID válido").isMongoId(),
    validateFields, verifyToken, verifyDeliveryTraysEstablishment],
    verifyDeliveryTraysEstablishmentSunday)

module.exports = router;