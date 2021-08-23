const { Router } = require("express");
const { createRole, getRoles } = require("../controllers/role.controller")

const router = Router();

router.post("/", [
], createRole
)

router.get("/", getRoles)

module.exports = router;