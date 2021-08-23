const { Router } = require("express");
const { postRoleAccess } = require("../controllers/role_access.controller")
const { validateFields } = require("../middlewares/validate_fields")
const { check } = require("express-validator");

const router = Router();

router.post("/", [
    check("id_role", "El rol es obligatorio").not().isEmpty(),
    check("id_role", "No es un ID válido").isMongoId(),
    check("id_access", "El acceso es obligatorio").not().isEmpty(),
    check("id_access", "No es un ID válido").isMongoId(),
    validateFields
], postRoleAccess
)

module.exports = router;