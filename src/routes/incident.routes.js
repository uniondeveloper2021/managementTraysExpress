const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth.jwt");
const { check } = require("express-validator");
const { getIncidents, postIncident, searchIncidentByName,
    updateIncidentById, deleteIncidentById }
    = require("../controllers/incident.controller")
const { validateFields } = require("../middlewares/validate_fields")

const router = Router();

router.get('/', [verifyToken], getIncidents);

router.post("/", [check("name", "El nombre es obligatorio").not().isEmpty(),
    validateFields, verifyToken
], postIncident)

router.get('/search/:name', [check("name", "El nombre obligatorio").not().isEmpty(),
    validateFields, verifyToken,
], searchIncidentByName);

router.put("/:incidentId", [check("incidentId", "El id es obligatorio").not().isEmpty(),
check("incidentId", "No es un ID válido").isMongoId(), validateFields, verifyToken,
], updateIncidentById);

router.delete("/:incidentId", [check("incidentId", "El id es obligatorio").not().isEmpty(),
check("incidentId", "No es un ID válido").isMongoId(), validateFields, verifyToken,
], deleteIncidentById);

module.exports = router;