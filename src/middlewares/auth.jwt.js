const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Role = require('../models/role.model')

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        if (!token) return res.status(403).json({
            message: "Token no previsto"
        });

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.id;

        const user = await User.findById(req.userId)
        if (!user) return res.status(400).json({
            status: 400,
            message: "Usuario no encontrado"
        });

        if (!user.status) return res.status(400).json({
            status: 400,
            message: "Usuario desactivado"
        });
        next();
        return;

    } catch (error) {
        return res.status(400).json({ status: 400, message: "No autorizado" });
    }
}

const verifyUsernameAndPassword = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const userFound = await User.findOne({ username: username });
        if (userFound) {
            const matchPassword = await User.comparePassword(
                password, userFound.password
            );
            if (!matchPassword)
                return res.status(202).json({
                    status: 202,
                    message: 'Usuario y/o Password Invalido'
                })
            if (!userFound.status)
                return res.status(400).json({
                    status: 400,
                    message: 'El usuario esta desactivado'
                })
            const information = await User.aggregate([
                { $match: { _id: userFound._id } },
                {
                    $lookup: {
                        from: 'roles', localField: 'id_role',
                        foreignField: '_id', as: 'role'
                    }
                }]);
            req.userFound = information;
            next();
        } else {
            return res.status(400).json({
                status: 400,
                message: "Usuario y/o password incorrectos"
            });
        }
    } catch (error) {
        return res.status(400).json({
            status: 400, message: "Error: " + error
        });
    }
}

const verifyAccessAndGenerateRefreshToken = async (req, res, next) => {
    try {
        const userFound = await User.findById(req.userId);
        const [userFoundRoles, informacion] = await Promise.all([
            User.aggregate([
                { $match: { _id: userFound["_id"] } },
                {
                    $lookup: {
                        from: 'roles', localField: 'id_role',
                        foreignField: '_id', as: 'role'
                    }
                }]),
            Role.aggregate(
                [{ $match: { _id: userFound["id_role"] } },
                {
                    $lookup: {
                        from: 'roleaccesos', localField: '_id',
                        foreignField: 'id_role', as: 'role_acceso'
                    }
                },
                {
                    $lookup: {
                        from: 'accesos', localField: 'role_acceso.id_access',
                        foreignField: '_id', as: 'acceso',
                    }
                },
                {
                    $unwind: '$acceso',
                }
                ])
        ]);

        req.userFound = userFoundRoles;
        const accesos = []
        informacion.forEach((e, i) => {
            accesos.push(informacion[i].acceso)
        })
        const token = jwt.sign({ id: userFound["_id"] },
            process.env.JWT_KEY, { expiresIn: "24h" })
        req.accesos = accesos
        req.token = token
        next();
        return;
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const verifyAccessAndGenerateToken = async (req, res, next) => {
    try {
        const userFound = req.userFound;
        const informacion = await Role.aggregate(
            [{ $match: { _id: userFound[0].id_role } },
            {
                $lookup: {
                    from: 'roleaccesos', localField: '_id',
                    foreignField: 'id_role', as: 'role_acceso'
                }
            },
            {
                $lookup: {
                    from: 'accesos', localField: 'role_acceso.id_access',
                    foreignField: '_id', as: 'acceso'
                }
            },
            {
                $unwind: '$acceso'
            }
            ])
        const accesos = []
        informacion.forEach((element, i) => {
            accesos.push(informacion[i].acceso)
        })
        const token = jwt.sign({ id: userFound[0]._id },
            process.env.JWT_KEY, { expiresIn: "24h" })
        req.accesos = accesos
        req.token = token
        next();
        return;
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    verifyToken,
    verifyUsernameAndPassword,
    verifyAccessAndGenerateToken,
    verifyAccessAndGenerateRefreshToken
};
