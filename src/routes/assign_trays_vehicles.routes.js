const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth.jwt");
const { check } = require("express-validator");
const { getAssignTraysVehiclesWithOutSupermarket, postAsignTraysVehicles,
    getAssignTraysVehiclesWithSupermarket, putAssignTraysVehicles,
    deleteAssignTraysVehiclesById } = require("../controllers/assign_trays_vehicles.controller")
const { validateFields } = require("../middlewares/validate_fields")
const router = Router();

router.get("/without-supermarket", [verifyToken], getAssignTraysVehiclesWithOutSupermarket)

router.get("/with-supermarket", [verifyToken], getAssignTraysVehiclesWithSupermarket)

router.post("/", [
    check("cant_trays", "La cantidad de charolas es obligatorio").not().isEmpty(),
    check("observation", "La observacion es obligatorio").not().isEmpty(),
    check("date", "La fecha es obligatorio").not().isEmpty(),
    check("id_user_controller", "El usuario es obligatorio").not().isEmpty(),
    check("number_day", "El id del dia es obligatorio").not().isEmpty(),
    check("id_vehicle", "El id del vehiculo es obligatorio").not().isEmpty(),
    check("id_user_controller", "No es un ID válido").isMongoId(),
    check("id_vehicle", "No es un ID válido").isMongoId(),
    validateFields, verifyToken
], postAsignTraysVehicles)

router.put("/:assignTraysId", [
    check("cant_trays", "La cantidad de charolas es obligatorio").not().isEmpty(),
    check("observation", "La observacion es obligatorio").not().isEmpty(),
    check("id_vehicle_new", "El id del vehiculo nuevo es obligatorio").not().isEmpty(),
    check("id_vehicle_old", "El id del vehiculo antiguo es obligatorio").not().isEmpty(),
    check("assignTraysId", "El id del vehiculo es obligatorio").not().isEmpty(),
    check("id_vehicle_new", "No es un ID válido").isMongoId(),
    check("id_vehicle_old", "No es un ID válido").isMongoId(),
    check("assignTraysId", "No es un ID válido").isMongoId(),
    validateFields, verifyToken
], putAssignTraysVehicles)

router.delete("/:assignTraysId", [
    check("assignTraysId", "El id del vehiculo es obligatorio").not().isEmpty(),
    check("assignTraysId", "No es un ID válido").isMongoId(),
    validateFields, verifyToken
], deleteAssignTraysVehiclesById)

module.exports = router;