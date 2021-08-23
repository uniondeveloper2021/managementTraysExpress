const Vehicle = require('../models/vehicle.model')
const TypeUserVehicle = require('../models/type_user_vehicle.model')

const postVehicle = async (req, res) => {
    const { img_url, placa, name_type } = req.body
    try {
        const [vehicleFound, typeFound] = await Promise.all([
            Vehicle.findOne({ placa: placa.toUpperCase(), status: true }),
            TypeUserVehicle.findOne({ name: name_type })
        ])
        const newVehicle = new Vehicle({
            img_url, placa, id_type: typeFound['_id'],
            status: true, status_free: true, status_assign: false
        });

        if (vehicleFound) return res.status(202).json({
            status: 202, message: "El placa ya existe"
        })
        if (!typeFound) return res.status(202).json({
            status: 202, message: "El tipo no existe"
        })
        const vehicleSaved = await newVehicle.save();

        return res.status(201).json({
            status: 201, data: vehicleSaved,
            message: "Vehiculo creado satisfactoriamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getVehicle = async (req, res) => {
    try {
        const query = { status: true }
        const [total, vehicle] = await Promise.all([
            Vehicle.countDocuments(query),
            Vehicle.find(query)
        ])
        return res.status(201).json({
            status: 201, total, data: vehicle,
            message: "Todos los vehiculos disponibles"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getVehicleStatusAssignTrueDistribution = async (req, res) => {
    await getVehicleTypeStatusAssignGeneral(req, res, true, 'Distribucion',
        "Todos los Vehiculos de tipo distribucion asignados");
}

const getVehicleStatusAssignFalseDistribution = async (req, res) => {
    await getVehicleTypeStatusAssignGeneral(req, res, false, 'Distribucion',
        "Todos los Vehiculos de tipo distribucion no asignados");
}

const getVehicleStatusAssignTrueBodegueroAdmins = async (req, res) => {
    await getVehicleTypeStatusAssignGeneral(req, res, true, 'Bodegueros/Administracion',
        "Todos los Vehiculos de tipo bodegueros-admins asignados");
}

const getVehicleStatusAssignFalseBodegueroAdmins = async (req, res) => {
    await getVehicleTypeStatusAssignGeneral(req, res, false, 'Bodegueros/Administracion',
        "Todos los Vehiculos de tipo bodegueros-admins no asignados");
}

const getVehicleTypeStatusAssignGeneral = async (req, res, status_assign, name, message) => {
    try {
        const typeVehicleFound = await TypeUserVehicle.findOne({ name })
        const query = { status: true, status_free: true, status_assign, id_type: typeVehicleFound._id }
        const [total, vehicle] = await Promise.all([
            Vehicle.countDocuments(query),
            Vehicle.find(query)
        ])
        return res.status(201).json({
            status: 201, total, data: vehicle, message
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getVehicleStatusFreeFalseTypeBodeguerosAdmins = async (req, res) => {
    await getVehicleTypeGeneral(req, res, false,
        "Todos los Vehiculos de tipo bodegueros-admins no disponibles", "Bodegueros/Administracion");
}

const getVehicleStatusFreeTrueTypeBodeguerosAdmins = async (req, res) => {
    await getVehicleTypeGeneral(req, res, true,
        "Todos los Vehiculos de tipo bodegueros-admins disponibles", "Bodegueros/Administracion");
}

const getVehicleStatusFreeFalseTypeDistribution = async (req, res) => {
    await getVehicleTypeGeneral(req, res, false,
        "Todos los Vehiculos de tipo distribucion no disponibles", "Distribucion");
}

const getVehicleStatusFreeTrueTypeDistribution = async (req, res) => {
    await getVehicleTypeGeneral(req, res, true,
        "Todos los Vehiculos de tipo distribucion disponibles", "Distribucion");
}

const getVehicleTypeGeneral = async (req, res, status_free, message, typeUserVehicle) => {
    try {
        const typeVehicleFound = await TypeUserVehicle.findOne({ name: typeUserVehicle })
        const query = { status: true, status_free, id_type: typeVehicleFound._id }
        const [total, vehicle] = await Promise.all([
            Vehicle.countDocuments(query),
            Vehicle.find(query)
        ])
        return res.status(201).json({
            status: 201, total, data: vehicle, message
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getVehicleForBodegueroAdmins = async (req, res) => {
    try {
        const type = await TypeUserVehicle.findOne({
            name: 'BODEGUERO_ADMIN_ROLE'
        })

        const query = { status: true, id_type: type._id }

        const [total, vehicles] = await Promise.all([
            TypeUserVehicle.countDocuments(query),
            TypeUserVehicle.find(query)
        ])

        return res.status(201).json({
            status: 201, total, data: vehicles,
            message: "Usuario: Bodeguero/admin"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const searchVehicleByPlaca = async (req, res) => {
    try {
        const placa = req.params.placa;
        const vehicleFound = await Vehicle.find({
            placa: { $regex: placa.toUpperCase() }
        });

        if (!vehicleFound)
            return res.status(400).json({
                status: 400,
                message: "El vehiculo no se encuentra en la base de datos"
            });

        return res.status(201).json({
            status: 201, data: vehicleFound,
            message: "Vehiculo encontrado satisfactoriamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const updateVehicleById = async (req, res) => {
    try {
        const _id = req.params.vehicleId;
        const { img_url } = req.body;
        const vehicleFound = await Vehicle.findById({ _id })
        if (!vehicleFound) return res.status(400).json({
            status: 400,
            message: "Vehicle no encontrado"
        });
        await Vehicle.findByIdAndUpdate(_id, { img_url: img_url });
        return res.status(201).json({
            status: 201,
            message: "Vehiculo modificado correctamente"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const deleteVehicleById = async (req, res) => {
    try {
        const _id = req.params.vehicleId;
        await Vehicle.findByIdAndUpdate(_id, { status: false });
        return res.status(201).json({
            status: 201,
            message: "Vehicle eliminado correctamente"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    postVehicle,
    getVehicle,
    searchVehicleByPlaca,
    updateVehicleById,
    deleteVehicleById,
    getVehicleForBodegueroAdmins,
    getVehicleStatusFreeFalseTypeDistribution,
    getVehicleStatusFreeTrueTypeDistribution,
    getVehicleStatusAssignTrueDistribution,
    getVehicleStatusAssignFalseDistribution,
    getVehicleStatusFreeFalseTypeBodeguerosAdmins,
    getVehicleStatusFreeTrueTypeBodeguerosAdmins
}