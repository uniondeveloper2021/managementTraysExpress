const User = require('../models/user.model')
const Role = require('../models/role.model')
const TypeUserVehicle = require('../models/type_user_vehicle.model')

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        const { username, email } = req.body;
        const [verifyUsername, verifyUserGmail] = await Promise.all([
            User.findOne({ username }),
            User.findOne({ email })
        ])
        if (verifyUsername)
            return res.status(202).json({ status: 202, message: 'El usuario ya existe' })

        if (verifyUserGmail)
            return res.status(202).json({ status: 202, message: 'El gmail ya existe' })
        next();
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
};

const verifyDniAndDriverLicense = async (req, res, next) => {
    try {
        const { driverss_license, dni } = req.body;
        const [driverLicenseFound, dniFound] = await Promise.all([
            User.findOne({ driverss_license }),
            User.findOne({ dni })
        ])
        if (dniFound)
            return res.status(202).json({ status: 202, message: "El DNI ya existe" });
        if (driverLicenseFound)
            return res.status(202).json({
                status: 202,
                message: "La licencia de conducir ya existe"
            });
        next();
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
};

const verifyExistsRoleAndType = async (req, res, next) => {
    try {
        const name_role = req.body.name_role;
        const name_type = req.body.name_type;
        const [roleFound, typeFound] = await Promise.all([
            Role.findOne({ name: name_role }),
            TypeUserVehicle.findOne({ name: name_type })
        ])
        if (!roleFound)
            return res.status(400).json({
                status: 400,
                message: "El Rol no existe"
            });

        if (!typeFound)
            return res.status(400).json({
                status: 400,
                message: "El Tipo no existe"
            });

        req.params.id_role = roleFound._id;
        req.params.id_type = typeFound._id;

        next();
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    checkDuplicateUsernameOrEmail,
    verifyDniAndDriverLicense,
    verifyExistsRoleAndType
}