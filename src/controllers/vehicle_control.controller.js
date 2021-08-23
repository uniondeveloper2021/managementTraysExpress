const TypeUserVehicle = require('../models/type_user_vehicle.model')
const VehicleControl = require('../models/vehicle_control.model')
const User = require('../models/user.model')
const Role = require('../models/role.model')
const Vehicle = require('../models/vehicle.model')

const postVehicleControl = async (req, res) => {
    try {
        const { number_km_output, img_url_km_output, id_user_bodega,
            id_vehicle } = req.body;

        const newVehicleControl = new VehicleControl({
            number_km_output, img_url_km_output,
            id_user_bodega, id_vehicle, status: true, status_available: true
        })

        const [userFound, roleFound, vehicleFound, typeFound] = await Promise.all([
            User.findById(id_user_bodega),
            Role.findOne({ name: "BODEGUERO_ADMIN_ROLE" }),
            Vehicle.findById(id_vehicle),
            TypeUserVehicle.findOne({ name: "Bodegueros/Administracion" })
        ])

        if (!userFound)
            return res.status(202).json({ status: 202, message: "Usuario no encontrado" });

        if (!roleFound)
            return res.status(202).json({ status: 202, message: "Role no encontrado" });

        if (!vehicleFound)
            return res.status(202).json({ status: 202, message: "Vehiculo no encontrado" });

        if (!typeFound)
            return res.status(202).json({ status: 202, message: "Tipo no encontrado" });

        if (userFound.id_role.toString() != roleFound._id.toString())
            return res.status(202).json({ status: 202, message: "Usuario no valido" });

        if (!userFound.status_free) return res.status(202).json({ status: 202,
            message: "El usuario no esta libre" });

        if (vehicleFound.id_type.toString() != typeFound._id.toString())
            return res.status(202).json({ status: 202, message: "Vehiculo no valido" });

        if (!vehicleFound.status_free) return res.status(202).json({
            status: 202, message: "El Vehiculo se encuentra ocupado" });

        await User.findByIdAndUpdate(userFound._id, { status_free: false});
        await Vehicle.findByIdAndUpdate(vehicleFound._id, { status_free: false});

        const vehicleControlSaved = await newVehicleControl.save();

        return res.status(201).json({
            status: 201, data: vehicleControlSaved,
            message: "Control del vehiculo creado satisfactoriamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}
 
const updateVehicleControlById = async (req, res) => {
    try {
        const { vehicleControlId } = req.params;

        const vehicleControlFound = await VehicleControl.findById(vehicleControlId);

        if (!vehicleControlFound) return res.status(202).json({ status: 202,
            message: "Control vehicular no encontrado" });

        await User.findByIdAndUpdate(userFound._id, { status_free: true });
        await Vehicle.findByIdAndUpdate(vehicleFound._id, { status_free: true });

        return res.status(201).json({
            status: 201, data: vehicleControlSaved,
            message: "Control del vehiculo modificador satisfactoriamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getVehicleControl = async (req, res) => {
    try {
        const information = await VehicleControl.aggregate([
            {
                $lookup: {
                    from: 'users', localField: 'id_user_bodega',
                    foreignField: '_id', as: 'user_bodega'
                }   
            },
            {
                $lookup: {
                    from: 'vehicles', localField: 'id_vehicle',
                    foreignField: '_id', as: 'vehicle'
                }
            },
        ])

        return res.status(201).json({ status: 201, data: information });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const searchVehicleControlByPlaca = async (req, res) => {
    try {
        const placa = req.params.placa;
        const vehicleFound = await VehicleControl.find({
            placa: { $regex: placa.toUpperCase() }
        });

        if (!vehicleFound)
            return res.status(400).json({
                status: 400,
                message: "Control de vehiculo no se encuentra en la base de datos"
            });

        return res.status(201).json({
            status: 201, data: vehicleFound,
            message: "Control de Vehiculo encontrado satisfactoriamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    postVehicleControl,
    searchVehicleControlByPlaca,
    getVehicleControl,
    updateVehicleControlById
}