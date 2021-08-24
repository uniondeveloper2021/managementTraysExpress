const User = require('../models/user.model')
const Role = require('../models/role.model')

const signUp = async (req, res) => {
    try {
        const { dni, first_name, last_name, username, password,
            email, img_url } = req.body;

        const { id_role, id_type } = req.params;

        const newUser = new User({
            dni, driverss_license: `Q${dni}`, first_name, last_name, username, password,
            email, img_url, status: true, status_free: true, status_isRoute: false,
            id_role, id_type
        })

        newUser.password = await User.encryptPassword(password);
        const userSaved = await newUser.save();

        return res.status(201).json({
            status: 201, data: userSaved,
            message: "Usuario creado satisfactoriamente"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getUserTypeMerchandiseController = async (req, res) => {
    await getUserTypeGeneral(req, res, 'CONT_MERC_ROLE',
        'Usuario: Controlador de mercaderia');
}

const getUserTypeSupermarketAgent = async (req, res) => {
    await getUserTypeGeneral(req, res, 'SUPMARK_AGENT_ROLE',
        'Usuario: Agente de supermercado');
}

const getUserTypeAssistant = async (req, res) => {
    await getUserTypeGeneral(req, res, 'ASSISTANT_ROLE',
        'Usuario: Auxiliar');
}

const getUserTypeBodeguero = async (req, res) => {
    await getUserTypeGeneral(req, res, 'BODEGUERO_ADMIN_ROLE',
        'Usuario: Bodeguero/Admin');
}

const getUserTypeGeneral = async (req, res, name_role, message) => {
    try {
        const roleFound = await Role.findOne({ name: name_role });

        if (!roleFound) return res.status(400).json({
            status: 400, message: "El rol no se encuentra en la base de datos"
        });

        const information = await User.aggregate([
            { $match: { id_role: roleFound["_id"] } },
            {
                $lookup: {
                    from: 'roles', localField: 'id_role',
                    foreignField: '_id', as: 'role'
                }
            }
        ])
        return res.status(201).json({ status: 201, data: information, message });
    }
    catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getUserTypeAssistantStatusFreeTrue = async (req, res) => {
    await getUserTypeGeneralStatusFree(req, res, 'ASSISTANT_ROLE',
        'Todos los auxiliares disponibles', true);
}

const getUserTypeAssistantStatusFreeFlase = async (req, res) => {
    await getUserTypeGeneralStatusFree(req, res, 'ASSISTANT_ROLE',
        'Todos los auxiliares no disponibles', false);
}

const getUserTypeGeneralStatusFree = async (req, res, name_role, message, status_free) => {
    try {
        const roleFound = await Role.findOne({ name: name_role });

        if (!roleFound) return res.status(400).json({
            status: 400, message: "El rol no se encuentra en la base de datos"
        });

        const information = await User.aggregate([
            { $match: { id_role: roleFound["_id"] } },
            { $match: { status_free: status_free } },
            {
                $lookup: {
                    from: 'roles', localField: 'id_role',
                    foreignField: '_id', as: 'role'
                }
            }
        ])
        return res.status(201).json({ status: 201, data: information, message });
    }
    catch (error) {
        return res.status(400).json({ status: 400, message: "Error:" + error });
    }
}

const getUserTypeSupermarketAgentNotAssignedRoute = async (req, res) => {
    await getUserTypeSupermarketAgentYesOrNotAppointed(req, res, false,
        'SUPMARK_AGENT_ROLE', 'Todos los agentes de supermercado no asignados a una ruta');
}

const getUserTypeSupermarketAgentAssignedRoute = async (req, res) => {
    await getUserTypeSupermarketAgentYesOrNotAppointed(req, res, true,
        'SUPMARK_AGENT_ROLE', 'Todos los agentes de supermercado asignados a una ruta');
}

const getUserTypeSupermarketAgentYesOrNotAppointed = async (req, res, status_isRoute, name_role, message) => {
    try {
        const role = await Role.findOne({ name: name_role })
        const query = { status: true, status_isRoute, id_role: role._id }
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.aggregate([
                { $match: { status: true } },
                { $match: { status_isRoute: status_isRoute } },
                { $match: { id_role: role._id } },
                {
                    $lookup: {
                        from: 'roles', localField: 'id_role',
                        foreignField: '_id', as: 'role'
                    }
                }
            ])
        ])
        return res.status(201).json({ status: 201, total, data: users, message });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const searchUserByName = async (req, res) => {
    try {
        const name = req.params.names;
        const userfound = await User.find({
            name: { $regex: name }
        });
        if (!userfound) return res.status(400).json({
            status: 400,
            message: "El usuario no se encuentra en la base de datos",
        });

        return res.status(201).json({
            status: 201, data: userfound,
            message: "Usuario encontrado satisfactoriamente"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const updateUserById = async (req, res) => {
    try {
        const _id = req.params.userId;
        const { password, ...resto } = req.body;
        const userfound = await User.findById({ _id })
        if (!userfound) return res.status(400).json({
            status: 400,
            message: "Usuario no encontrado"
        });

        if (password) resto.password = await User.encryptPassword(password);
        await User.findByIdAndUpdate(_id, resto);
        return res.status(201).json({
            status: 201, message: "Usuario modificado correctamente"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const updateUserAgentSupermarketStatusFreeToFalse = async (req, res) => {
    try {
        const _id = req.params.userId;

        const [userFound, roleFound] = await Promise.all([
            User.findById({ _id }),
            Role.findOne({ name: "SUPMARK_AGENT_ROLE" }),
        ])

        if (!userFound) return res.status(400).json({
            status: 400, message: "Usuario no encontrado"
        });

        if (!roleFound) return res.status(400).json({
            status: 400, message: "El rol no existe"
        });

        if (userFound.id_role.toString() != roleFound._id.toString())
            return res.status(202).json({ status: 202, message: "El usuario no es agente" });

        await User.findByIdAndUpdate(_id, { status_free: false });

        return res.status(201).json({
            status: 201, message: "Usuario modificado correctamente"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const deleteUserById = async (req, res) => {
    try {
        const _id = req.params.userId;
        await User.findByIdAndUpdate(_id, { status: false });
        return res.status(201).json({
            status: 201,
            message: "Usuario eliminado correctamente"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    signUp,
    getUserTypeMerchandiseController,
    getUserTypeSupermarketAgent,
    getUserTypeAssistant,
    searchUserByName,
    updateUserById,
    updateUserAgentSupermarketStatusFreeToFalse,
    deleteUserById,
    getUserTypeBodeguero,
    getUserTypeSupermarketAgentNotAssignedRoute,
    getUserTypeSupermarketAgentAssignedRoute,
    getUserTypeAssistantStatusFreeTrue,
    getUserTypeAssistantStatusFreeFlase
}