const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth.jwt");
const { check } = require("express-validator");
const { postDay } = require("../controllers/day.controller")
const { validateFields } = require("../middlewares/validate_fields")
const router = Router();

router.post("/", [
    check("number", "El numero es obligatorio").not().isEmpty(),
    check("day", "El dia es obligatorio").not().isEmpty(),
    validateFields, verifyToken
], postDay);

module.exports = router;