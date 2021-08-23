const { Router } = require("express");
const { check } = require("express-validator");
const { refreshToken, signIn } = require("../controllers/auth.controller")
const { verifyToken, verifyUsernameAndPassword, verifyAccessAndGenerateToken,
    verifyAccessAndGenerateRefreshToken } = require("../middlewares/auth.jwt")
const { validateFields } = require("../middlewares/validate_fields")

const router = Router();

router.post("/signin", [
    check("username", "El usuario es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validateFields, verifyUsernameAndPassword, verifyAccessAndGenerateToken
], signIn )

router.get("/refresh-token", verifyToken, verifyAccessAndGenerateRefreshToken,
    refreshToken);

module.exports = router;