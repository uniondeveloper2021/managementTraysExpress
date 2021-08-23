const EstablishmentRoute = require('../models/establishment_routes.model')
const User = require('../models/user.model')
const Role = require('../models/role.model')
const Route = require('../models/routes.model')
const Establishment = require('../models/establishment.model')
const Day = require('../models/day.model')

// TODO: READY: Al final de todos los insert, correr esta funcion updateUserAgentSupermarketStatusFreeToFalse
// establishment y asignacion status_is_delivery a false
const postEstablishmentRoute = async (req, res) => {
    try {
        const { id_user_agent, id_establishment, number } = req.body
        const [userFound, roleFound, establishmentFound, dayFound] = await Promise.all([
            User.findById(id_user_agent),
            Role.findOne({ name: "SUPMARK_AGENT_ROLE" }),
            Establishment.findById(id_establishment),
            Day.findOne({number: number}),
        ])

        if (!userFound)
            return res.status(202).json({ status: 202, message: "Usuario no encontrado" });

        if (!roleFound)
            return res.status(202).json({ status: 202, message: "Rol no encontrado" });

        if (!establishmentFound)
            return res.status(202).json({ status: 202, message: "Establecimiento no encontrado" });

        if (!dayFound)
            return res.status(202).json({ status: 202, message: "Dia no encontrado" });

        if (userFound.id_role.toString() != roleFound._id.toString())
            return res.status(202).json({ status: 202, message: "Usuario no valido" });

        if (!userFound.status_free)
            return res.status(202).json({ status: 202, message: "El usuario no esta libre" });

        if (!establishmentFound.status_free)
            return res.status(202).json({ status: 202, message: "El establecimiento no esta libre" });

        const [lastRouteInsert, establishmentCreated, userUpdated] = await Promise.all([
            await Route.find().sort({ $natural: -1 }).limit(1),
            Establishment.findByIdAndUpdate(id_establishment, { status_free: false }),
            User.findByIdAndUpdate(id_user_agent, { status_isRoute: true })
        ]);

        const newEstablishmentRoute = new EstablishmentRoute({
            status: true, id_user_agent, id_route: lastRouteInsert[0]._id, id_establishment,
            id_day, status_is_delivery: false,
        })

        const establishmentRouteSaved = await newEstablishmentRoute.save();

        return res.status(201).json({ status: 201, data: establishmentRouteSaved });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getEstablishmentByRouteAndIdUserStatusDeliveryTrue = async (req, res) => {
    await getEstablishmentByRouteAndIdUserGeneral(req, res, true, "Todas los establecimientos de este dia");
}

const getEstablishmentByRouteAndIdUserStatusDeliveryFalse = async (req, res) => {
    await getEstablishmentByRouteAndIdUserGeneral(req, res, false, "Todas los establecimientos de este dia");
}

const getEstablishmentByRouteAndIdUserGeneral = async (req, res, status_is_delivery, message) => {
    try {
        const { id_user, number } = req.params;

        const [userFound, roleFound, dayFound] = await Promise.all([
            User.findById(id_user),
            Role.findOne({ name: "SUPMARK_AGENT_ROLE" }),
            Day.findOne({ number: number }),
        ])

        if (!userFound)
            return res.status(202).json({ status: 202, message: "Usuario no encontrado" });

        if (!roleFound)
            return res.status(202).json({ status: 202, message: "Rol no encontrado" });

        if (!dayFound)
            return res.status(202).json({ status: 202, message: "Dia no encontrado" });

        if (userFound.id_role.toString() != roleFound._id.toString())
            return res.status(202).json({ status: 202, message: "Usuario no valido" });

        const informacion = await EstablishmentRoute.aggregate([
            { $match: { id_user_agent: userFound._id } },
            { $match: { id_day: dayFound._id } },
            { $match: { status_is_delivery } },
            {
                $lookup: {
                    from: 'establishments', localField: 'id_establishment',
                    foreignField: '_id', as: 'establishment'
                }
            },
        ])

        return res.status(201).json({ status: 201, data: informacion, message });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getEstablishmentRoute = async (req, res) => {
    try {
        const information = await EstablishmentRoute.aggregate([
            {
                $lookup: {
                    from: 'users', localField: 'id_user_agent',
                    foreignField: '_id', as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'routes', localField: 'id_route',
                    foreignField: '_id', as: 'route'
                }
            },
            {
                $lookup: {
                    from: 'establishments', localField: 'id_establishment',
                    foreignField: '_id', as: 'establishment'
                }
            },
            {
                $lookup: {
                    from: 'days', localField: 'id_day',
                    foreignField: '_id', as: 'day'
                }
            }
        ])
        return res.status(201).json({ status: 201, data: information });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getEstablishmentRouteByRoute = async (req, res) => {
    try {
        const { id_route } = req.params;
        const routeFound = await Route.findById(id_route);
        if (!routeFound)
            return res.status(400).json({ status: 400, message: "La ruta no existe" });

        const information = await EstablishmentRoute.aggregate([
            { $match: { id_route: routeFound['_id'] } },
            {
                $lookup: {
                    from: 'users', localField: 'id_user_agent',
                    foreignField: '_id', as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'routes', localField: 'id_route',
                    foreignField: '_id', as: 'route'
                }
            },
            {
                $lookup: {
                    from: 'establishments', localField: 'id_establishment',
                    foreignField: '_id', as: 'establishment'
                }
            },
            {
                $lookup: {
                    from: 'days', localField: 'id_day',
                    foreignField: '_id', as: 'day'
                }
            }
        ])
        return res.status(201).json({ status: 201, data: information });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}


module.exports = {
    getEstablishmentRoute,
    getEstablishmentRouteByRoute,
    postEstablishmentRoute,
    getEstablishmentByRouteAndIdUserStatusDeliveryTrue,
    getEstablishmentByRouteAndIdUserStatusDeliveryFalse
}