const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth.jwt");
const { check } = require("express-validator");
const { postVehicle, getVehicle, searchVehicleByPlaca, updateVehicleById,
    deleteVehicleById, getVehicleForBodegero, getVehicleStatusFreeFalseTypeDistribution,
    getVehicleStatusFreeTrueTypeDistribution, getVehicleStatusAssignTrueDistribution,
    getVehicleStatusAssignFalseDistribution, getVehicleStatusFreeFalseTypeBodeguerosAdmins,
    getVehicleStatusFreeTrueTypeBodeguerosAdmins} = require("../controllers/vehicle.controller")
const { validateFields } = require("../middlewares/validate_fields")
const router = Router();

router.get('/', [verifyToken], getVehicle);

router.get('/status-free-true-distribution', [verifyToken], getVehicleStatusFreeTrueTypeDistribution);

router.get('/status-free-false-distribution', [verifyToken], getVehicleStatusFreeFalseTypeDistribution);

router.get('/status-assign-true-distribution', [verifyToken], getVehicleStatusAssignTrueDistribution);

router.get('/status-assign-false-distribution', [verifyToken], getVehicleStatusAssignFalseDistribution);

router.get('/status-free-true-bodeguero-admins', [verifyToken], getVehicleStatusFreeTrueTypeBodeguerosAdmins);

router.get('/status-free-false-bodeguero-admins', [verifyToken], getVehicleStatusFreeFalseTypeBodeguerosAdmins);

router.get('/status-assign-true-bodeguero-admins', [verifyToken], getVehicleStatusAssignTrueDistribution);

router.get('/status-assign-false-bodeguero-admins', [verifyToken], getVehicleStatusAssignFalseDistribution);


router.post("/", [check("placa", "El placa es obligatorio").not().isEmpty(),
    check("name_type", "El nombre del tipo es obligatorio").not().isEmpty(),
    validateFields, verifyToken
], postVehicle)

router.get('/search/:placa', [
    check("placa", "La placa es obligatorio").not().isEmpty(),
    validateFields, verifyToken,
], searchVehicleByPlaca);

router.put("/:vehicleId", [check("vehicleId", "El id es obligatorio").not().isEmpty(),
check("vehicleId", "No es un ID válido").isMongoId(), validateFields, verifyToken,
], updateVehicleById);

router.delete("/:vehicleId", [check("vehicleId", "El id es obligatorio").not().isEmpty(),
check("vehicleId", "No es un ID válido").isMongoId(), validateFields, verifyToken,
], deleteVehicleById);

module.exports = router;