const DeliveryTraysEstabl = require('../models/delivery_trays_establishments.model')
const User = require('../models/user.model')
const Role = require('../models/role.model')
const TypeUserVehicle = require('../models/type_user_vehicle.model')
const AssignTrayVehicle = require('../models/assign_trays_vehicles.model')

const getDeliveryTraysEstablishmentByIdUser = async (req, res) => {
    try {
        const id_user = req.params.userId;
        const [userFound, roleFound, typeDistributionFound] = await Promise.all([
            User.findById(id_user),
            Role.findOne({ name: "SUPMARK_AGENT_ROLE" }),
            TypeUserVehicle.findOne({ name: "Distribucion" })
        ])

        if (!userFound)
            return res.status(202).json({ status: 202, message: "El usuario no existe" })

        if (!roleFound)
            return res.status(202).json({ status: 202, message: "El rol no existe" })

        if (!typeDistributionFound)
            return res.status(202).json({ status: 202, message: "El tipo no existe" })

        if (userFound.id_role.toString() != roleFound._id.toString())
            return res.status(202).json({ status: 202, message: "Usuario no valido" });

        if (userFound.id_type.toString() != typeDistributionFound._id.toString())
            return res.status(202).json({
                status: 202,
                message: "El ususario no es de tipo distribucion"
            });

        const information = await DeliveryTraysEstabl.aggregate([
            { $match: { id_user_agent: userFound['_id'] } },
            {
                $lookup: {
                    from: 'users', localField: 'id_user_agent',
                    foreignField: '_id', as: 'user'
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
                    from: 'vehicles', localField: 'id_vehicle',
                    foreignField: '_id', as: 'vehicle'
                }
            },
            {
                $lookup: {
                    from: 'incidents', localField: 'id_incident',
                    foreignField: '_id', as: 'incident'
                }
            }
        ]);

        return res.status(201).json({
            status: 201, data: information,
            message: "Listado correctamente"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getDeliveryTraysEstablishment = async (req, res) => {
    try {
        const information = await DeliveryTraysEstabl.aggregate([
            {
                $lookup: {
                    from: 'users', localField: 'id_user_agent',
                    foreignField: '_id', as: 'user'
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
                    from: 'incidents', localField: 'id_incident',
                    foreignField: '_id', as: 'incident'
                }
            },
            {
                $lookup: {
                    from: 'vehicles', localField: 'id_vehicle',
                    foreignField: '_id', as: 'vehicle'
                }
            }
        ])
        return res.status(201).json({
            status: 201, data: information,
            message: "Todas las entregas de charolas en los establecimientos"
        });

    } catch (err) {
        return res.status(400).json({ status: 400, message: err });
    }
}

const postDeliveryTraysEstabl = async (req, res) => {
    try {
        const { trays_delivered, collected_trays, observation, date, id_user_agent,
            id_establishment, id_incident } = req.body;

        const { id_assign_trays_vehicle, id_day, id_vehicle } = req.params;

        const query = { id_user_supermark: id_user_agent, status_free: false, status_using: true };
        
        const [newDeliveryTraysEstabl, assignFound]
            = await Promise.all([
                new DeliveryTraysEstabl({
                    trays_delivered, collected_trays, observation,
                    id_user_agent, id_establishment, id_incident, id_vehicle, id_day,
                    date, id_assign_trays_vehicle, status: true, status_is_delivery: true
                }),
                AssignTrayVehicle.findOne(query)
            ]);

        const newDeliveryTraysEstablSaved = await newDeliveryTraysEstabl.save()

        return res.status(201).json({
            status: 201, data: newDeliveryTraysEstablSaved,
            cant_trays: assignFound.cant_trays_delivery,
            message: "Asignacion designado satisfactoriamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error:" + error });
    }
}

const postDeliveryTraysEstablDaySunday = async (req, res) => {
    try {
        const { trays_delivered, collected_trays, observation, date, id_user_agent,
            id_establishment, id_incident } = req.body;

        const { id_assign_trays_vehicle, id_day, id_vehicle } = req.params;

        const query = { id_user_supermark: id_user_agent, status_free: false, status_using: true };
        
        const [newDeliveryTraysEstabl, assignFound]
            = await Promise.all([
                new DeliveryTraysEstabl({
                    trays_delivered, collected_trays, observation,
                    id_user_agent, id_establishment, id_incident, id_vehicle, id_day,
                    date, id_assign_trays_vehicle, status: true, status_is_delivery: true
                }),
                AssignTrayVehicle.findOne(query)
            ]);

        const newDeliveryTraysEstablSaved = await newDeliveryTraysEstabl.save()

        return res.status(201).json({
            status: 201, data: newDeliveryTraysEstablSaved,
            cant_trays: assignFound.cant_trays_delivery,
            message: "Asignacion designado satisfactoriamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error:" + error });
    }
}

const updateDeliveryTraysEstablById = async (req, res) => {
    try {
        const _id = req.params.deliveryTraysEstablId;
        const { trays_delivered, collected_trays, observation,
            id_establishment } = req.body
        const deliveryTraysEstablFound = await DeliveryTraysEstabl.findById({ _id })

        if (!deliveryTraysEstablFound) return res.status(400).json({
            status: 400,
            message: "Entrega de charolas en el establecimiento no encontrado"
        });

        await DeliveryTraysEstabl.findByIdAndUpdate(_id,
            { trays_delivered, collected_trays, observation, id_establishment });

        return res.status(201).json({
            status: 201,
            message: "Entrega de charolas modificado correctamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: error });
    }
}

module.exports = {
    getDeliveryTraysEstablishment,
    getDeliveryTraysEstablishmentByIdUser,
    postDeliveryTraysEstabl,
    postDeliveryTraysEstablDaySunday,
    updateDeliveryTraysEstablById
}
