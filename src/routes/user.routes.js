const { Router } = require("express");
const { checkDuplicateUsernameOrEmail, verifyDniAndDriverLicense,
    verifyExistsRoleAndType } = require("../middlewares/verifysignup")
const { check } = require("express-validator");
const { verifyToken } = require("../middlewares/auth.jwt");
const { validateFields } = require("../middlewares/validate_fields")
const { signUp, getUserTypeMerchandiseController, getUserTypeSupermarketAgent,
    getUserTypeAssistant, getUserTypeBodeguero, searchUserByName, updateUserById,
    getUserTypeSupermarketAgentNotAssignedRoute, getUserTypeSupermarketAgentAssignedRoute,
    deleteUserById, updateUserAgentSupermarketStatusFreeToFalse, getUserTypeAssistantStatusFreeTrue,
    getUserTypeAssistantStatusFreeFlase } = require("../controllers/user.controller")

const router = Router();

router.get('/user-merchandise', [verifyToken], getUserTypeMerchandiseController);

router.get('/user-assistant', [verifyToken], getUserTypeAssistant);

router.get('/user-assistant-status-free-true', [verifyToken], getUserTypeAssistantStatusFreeTrue);

router.get('/user-assistant-status-free-false', [verifyToken], getUserTypeAssistantStatusFreeFlase);

router.get('/user-bodeguero', [verifyToken], getUserTypeBodeguero);

router.get('/user-supermarket', [verifyToken], getUserTypeSupermarketAgent);

router.get('/user-supermarket/is-route', [verifyToken], getUserTypeSupermarketAgentAssignedRoute);

router.get('/user-supermarket/is-not-route', [verifyToken], getUserTypeSupermarketAgentNotAssignedRoute);

router.post('/', [
    check("dni", "El dni es obligatorio").not().isEmpty(),
    check("first_name", "El nombre es obligatorio").not().isEmpty(),
    check("last_name", "El apellido es obligatorio").not().isEmpty(),
    check("username", "El usuario es obligatorio").not().isEmpty(),
    check("password", "No password es obligatorio").not().isEmpty(),
    check("email", "No email es obligatorio").not().isEmpty(),
    check("email", "No es un email valido").isEmail(),
    check("img_url", "La imagen es obligatorio").not().isEmpty(),
    check("name_role", "El rol es obligatorio").not().isEmpty(),
    check("name_type", "El tipo es obligatorio").not().isEmpty(),
    validateFields, verifyToken, checkDuplicateUsernameOrEmail,
    verifyDniAndDriverLicense, verifyExistsRoleAndType,
], signUp)

router.get('/search/:name', [check("name", "El nombre obligatorio").not().isEmpty(),
    validateFields, verifyToken
], searchUserByName);

router.put("/:userId", [check("userId", "El id es obligatorio").not().isEmpty(),
check("userId", "No es un ID válido").isMongoId(), validateFields, verifyToken
], updateUserById);

router.put("/status-free-to-false/:userId", [check("userId", "El id es obligatorio").not().isEmpty(),
check("userId", "No es un ID válido").isMongoId(), validateFields, verifyToken
], updateUserAgentSupermarketStatusFreeToFalse);

router.put("/:userId", [check("userId", "El id es obligatorio").not().isEmpty(),
check("userId", "No es un ID válido").isMongoId(), validateFields, verifyToken
], deleteUserById);

module.exports = router;