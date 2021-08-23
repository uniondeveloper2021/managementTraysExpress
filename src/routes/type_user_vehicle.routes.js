const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth.jwt");
const { check } = require("express-validator");
const {  postTypeUserVehicle, getTypeUserVehicle, searchUserByName,
    updateTypeById } = require("../controllers/type_user_vehicle.controller")
const { validateFields } = require("../middlewares/validate_fields")
const router = Router();

router.get('/', [verifyToken], getTypeUserVehicle);

router.post("/", [check("name", "El nombre es obligatorio").not().isEmpty(),
    validateFields, verifyToken,
], postTypeUserVehicle)

router.get('/search/:name', [check("name", "El nombre es obligatorio").not().isEmpty(),
    validateFields, verifyToken,
], searchUserByName);

router.put("/:vehicleId", [check("vehicleId",
    "El id es obligatorio").not().isEmpty(),
    check("vehicleId", "No es un ID válido").isMongoId(),
    validateFields, verifyToken,
], updateTypeById);

// router.delete("/:typeUserVehicleId", [check("typeUserVehicleId", "El id es obligatorio").not().isEmpty(),
// check("typeUserVehicleId", "No es un ID válido").isMongoId(), validateFields, verifyToken,
// ], deleteVehicleById);

module.exports = router;