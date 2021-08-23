const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth.jwt");
const { check } = require("express-validator");
const { getEstablishmentByRouteAndIdUserStatusDeliveryTrue, getEstablishmentRoute,
    postEstablishmentRoute, getEstablishmentByRouteAndIdUserStatusDeliveryFalse,
    getEstablishmentRouteByRoute } = require("../controllers/establishment_routes.controller")
const { validateFields } = require("../middlewares/validate_fields")
const router = Router();

router.get("/", [verifyToken], getEstablishmentRoute)

router.get("/route/:id_route", [
    check("id_route", "El id de la ruta es obligatorio").not().isEmpty(),
    check("id_route", "No es un ID válido").isMongoId(),
    verifyToken], getEstablishmentRouteByRoute)

router.post("/", [
    check("id_user_agent", "El id de agente es obligatorio").not().isEmpty(),
    check("id_establishment", "El id del establecimiento es obligatorio").not().isEmpty(),
    check("number", "El id del dia es obligatorio").not().isEmpty(),
    check("id_user_agent", "No es un ID válido").isMongoId(),
    check("id_establishment", "No es un ID válido").isMongoId(),
    validateFields, verifyToken],
    postEstablishmentRoute)

router.get("/establishment-true-route-user/:id_user/:number", [
    check("id_user", "El usuario es obligatorio").not().isEmpty(),
    check("number", "El dia es obligatorio").not().isEmpty(),
    check("id_user", "No es un ID válido").isMongoId(),
    validateFields, verifyToken],
    getEstablishmentByRouteAndIdUserStatusDeliveryTrue)

router.get("/establishment-false-route-user/:id_user/:number", [
    check("id_user", "El usuario es obligatorio").not().isEmpty(),
    check("number", "El dia es obligatorio").not().isEmpty(),
    check("id_user", "No es un ID válido").isMongoId(),
    validateFields, verifyToken],
    getEstablishmentByRouteAndIdUserStatusDeliveryFalse)

module.exports = router;