const { Router } = require("express");
const { postAccess, getAccess } = require("../controllers/access.controller")
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate_fields")

const router = Router();

router.get("/", getAccess)

router.post("/", [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("path", "La ruta es obligatorio").not().isEmpty(),
    check("icon", "El icono es obligatorio").not().isEmpty(),
    validateFields
], postAccess)

module.exports = router;