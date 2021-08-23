const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth.jwt");
const { check } = require("express-validator");
const { postRoute, getRoute, searchRouteByName } = require("../controllers/routes.controller")
const { validateFields } = require("../middlewares/validate_fields")
const router = Router();

router.get('/', [verifyToken], getRoute);

router.post("/", [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("number", "La numbero es obligatorio").not().isEmpty(),
    validateFields, verifyToken],
postRoute)

router.get('/search/:name', [check("name", "El nombre obligatorio").not().isEmpty(),
    validateFields, verifyToken,
], searchRouteByName);

module.exports = router;