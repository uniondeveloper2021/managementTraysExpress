const SelectUserVehicle = require('../models/select_user_vehicle.model')
const User = require('../models/user.model')
const AssignTrayVehicle = require('../models/assign_trays_vehicles.model')
const EstablishmentRoute = require('../models/establishment_routes.model')
const Establishment = require('../models/establishment.model')
const Day = require('../models/day.model')
const Vehicle = require('../models/vehicle.model')

const getSelectUserVehicleByIdUserAndActive = async (req, res) => {
    return res.status(400).json({ status: 400, message: "Error: " });
};

const getSelectUserVehicleByIdUserAndNotActive = async (req, res) => {
    return res.status(400).json({ status: 400, message: "Error: " });
};

const getSelectUserVehicleStatusActiveTrue = async (req, res) => {
    try {
        await getSelectUserVehicleGeneral(req, res, true);
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getSelectUserVehicleStatusActiveFalse = async (req, res) => {
    try {
        await getSelectUserVehicleGeneral(req, res, false);
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getSelectUserVehicleGeneral = async (req, res, status) => {
    try {
        const _id = req.params.userAgent;
        const agentFound = await User.findById({ _id });
        const information = await SelectUserVehicle.aggregate([
            { $match: { id_user_agent: agentFound._id } },
            { $match: { status_active: status } },
            {
                $lookup: {
                    from: 'users', localField: 'id_user_agent',
                    foreignField: '_id', as: 'user_agent'
                }
            },
            {
                $lookup: {
                    from: 'users', localField: 'id_user_auxiliar',
                    foreignField: '_id', as: 'user_auxiliar'
                }
            },
            {
                $lookup: {
                    from: 'vehicles', localField: 'id_vehicle',
                    foreignField: '_id', as: 'vehicle'
                }
            },
        ])

        return res.status(201).json({
            status: 201, data: information,
            message: "Seleccion de usuario vehiculos"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const postSelectUserVehicle = async (req, res) => {
    try {
        const { number_km_output, img_url_km_output, id_user_auxiliar, observation_output,
            id_user_agent, id_vehicle, date_output } = req.body;
        const { assignByIdVehicleId, id_day, cant_trays } = req.params;

        console.log(cant_trays);

        const newSelectUserVehicle = new SelectUserVehicle({
            number_km_output, img_url_km_output, id_user_agent, date_output,
            observation_output, id_user_auxiliar, id_vehicle,
            id_assign_trays_vehicles: assignByIdVehicleId,
            status: true, status_active: true, id_day
        });

        const selectUserVehicleSaved = await newSelectUserVehicle.save();
        return res.status(201).json({
            status: 201, data: selectUserVehicleSaved,
            message: "Vehiculo seleccionado satisfactoriamente", cant_trays,
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const updateSelectUserVehicleDeliveryVehicle = async (req, res) => {
    try {
        const _id = req.params.selectUserVehicleId;
        const { number_km_return, img_url_km_return, date_return,
            observation_return } = req.body;
        const selectUserVehicleFound = await SelectUserVehicle.findById({ _id })

        if (!selectUserVehicleFound) return res.status(400).json({
            status: 400, message: "La seleccion de usuario vehiculo no se ha encontrado"
        });

        const id_user_agent = selectUserVehicleFound["id_user_agent"];
        const id_user_auxiliar = selectUserVehicleFound["id_user_auxiliar"];
        const id_vehicle = selectUserVehicleFound["id_vehicle"];
        const id_assign_trays_vehicles = selectUserVehicleFound["id_assign_trays_vehicles"];
        const id_day = selectUserVehicleFound["id_day"];

        const [selectUserUpdate, agentUpdate, assistantUpdate, numberDayFound,
            vehicleUpdate, assignTrayVehicleFound] = await Promise.all([
                SelectUserVehicle.findByIdAndUpdate(_id, {
                    number_km_return: number_km_return,
                    img_url_km_return: img_url_km_return,
                    date_return: date_return,
                    observation_return: observation_return,
                    status_active: false,
                }),
                User.findByIdAndUpdate(id_user_agent, { status_free: true }),
                User.findByIdAndUpdate(id_user_auxiliar, { status_free: true }),
                Day.findById(id_day),
                Vehicle.findByIdAndUpdate(id_vehicle, { status_free: true, status_assign: false }),
                AssignTrayVehicle.findById(id_assign_trays_vehicles)
            ]);

        const [assignUpdate, establishmentFound] = await Promise.all([
            AssignTrayVehicle.findByIdAndUpdate(id_assign_trays_vehicles,
                {
                    cant_trays_delivery: 0, cant_trays_undelivery: assignTrayVehicleFound.cant_trays_delivery,
                    status_using: false
                }),
            EstablishmentRoute.aggregate([
                { $match: { id_day: numberDayFound._id } },
                { $match: { id_user_agent: id_user_agent } },
                {
                    $lookup: {
                        from: 'establishments', localField: 'id_establishment',
                        foreignField: '_id', as: 'establishment'
                    }
                },
            ])
        ])

        establishmentFound.forEach(async (item) => {
            const _id = item['establishment'][0]._id;
            await Establishment.findByIdAndUpdate(_id, { status_is_delivery: false });
            await EstablishmentRoute.findByIdAndUpdate(item['_id'], { status_is_delivery: false });
        })

        return res.status(201).json({
            status: 201, message: "Seleccion modificada correctamente"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    getSelectUserVehicleStatusActiveTrue,
    getSelectUserVehicleStatusActiveFalse,
    postSelectUserVehicle,
    updateSelectUserVehicleDeliveryVehicle
}