const AssignTraysVehicles = require('../models/assign_trays_vehicles.model')
const TypeUserVehicle = require('../models/type_user_vehicle.model')
const User = require('../models/user.model')
const Role = require('../models/role.model')
const Day = require('../models/day.model')
const Vehicle = require('../models/vehicle.model')

const getAssignTraysVehiclesWithOutSupermarket = async (req, res) => {
    try {
        const information = await AssignTraysVehicles.aggregate([
            { $match: { status_free: true } },
            {
                $lookup: {
                    from: 'users', localField: 'id_user_controller',
                    foreignField: '_id', as: 'user_controller'
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
            message: "Asignacion de charolas en vehiculos"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getAssignTraysVehiclesWithSupermarket = async (req, res) => {
    try {
        const information = await AssignTraysVehicles.aggregate([
            { $match: { status_free: false } },
            {
                $lookup: {
                    from: 'users', localField: 'id_user_controller',
                    foreignField: '_id', as: 'user_controller'
                }
            },
            {
                $lookup: {
                    from: 'users', localField: 'id_user_supermark',
                    foreignField: '_id', as: 'user_supermark'
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
            message: "Asignacion de charolas en vehiculos"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const postAsignTraysVehicles = async (req, res) => {
    try {
        const { cant_trays, observation, id_user_controller,
            number_day, id_vehicle, date } = req.body;

        const [userFound, roleFound, vehicleFound, typeDistributionFound,
            dayFound] = await Promise.all([
                User.findById(id_user_controller),
                Role.findOne({ name: "CONT_MERC_ROLE" }),
                Vehicle.findById(id_vehicle),
                TypeUserVehicle.findOne({ name: "Distribucion" }),
                Day.findOne({ number: number_day })
            ]);

        if (!userFound)
            return res.status(202).json({ status: 202, message: "El usuario no existe" })

        if (!roleFound)
            return res.status(202).json({ status: 202, message: "El rol no existe" })

        if (!vehicleFound)
            return res.status(202).json({ status: 202, message: "El vehiculo no existe" })

        if (!dayFound)
            return res.status(202).json({ status: 202, message: "El dia no existe" })

        if (userFound.id_role.toString() != roleFound._id.toString())
            return res.status(202).json({ status: 202, message: "Usuario no valido" });

        if (vehicleFound.id_type.toString() != typeDistributionFound._id.toString())
            return res.status(202).json({ status: 202, message: "El Vehiculo no es de tipo distribucion" });

        if (!vehicleFound.status_free)
            return res.status(202).json({ status: 202, message: "El vehiculo no esta libre" });

        if (vehicleFound.status_assign)
            return res.status(202).json({ status: 202, message: "El vehiculo ya ha sido asignado" });

        await Vehicle.findByIdAndUpdate(id_vehicle, { status_assign: true })

        const newAsignTraysVehicles = new AssignTraysVehicles({
            cant_trays, cant_trays_delivery: cant_trays, observation, id_user_controller,
            id_vehicle, id_day: dayFound["_id"], date, status: true, status_free: true, status_using: true
        })

        const newAsignTraysVehiclesSaved = await newAsignTraysVehicles.save()

        return res.status(201).json({
            status: 201, data: newAsignTraysVehiclesSaved,
            message: "Asignacion realizada satisfactoriamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const putAssignTraysVehicles = async (req, res) => {
    try {
        const _id = req.params.assignTraysId;
        const { cant_trays, observation, id_vehicle_new, id_vehicle_old } = req.body;

        const [assignTraysFound, vehicleFound, vehicleOldFound, typeDistributionFound]
            = await Promise.all([
                AssignTraysVehicles.findById({ _id }),
                Vehicle.findById(id_vehicle_new),
                Vehicle.findById(id_vehicle_old),
                TypeUserVehicle.findOne({ name: "Distribucion" }),
            ]);

        if (!assignTraysFound) return res.status(400).json({
            status: 400, message: "Asignacion de charolas no encontrado"
        });

        if (!vehicleFound) return res.status(400).json({
            status: 400, message: "Vehiculo nuevo no encontrado"
        });

        if (!vehicleOldFound) return res.status(400).json({
            status: 400, message: "Vehiculo anterior no encontrado"
        });

        if (vehicleFound.status_assign) return res.status(400).json({
            status: 400, message: "El vehiculo ya ha sido asignado"
        });

        if (!vehicleFound.status_free) return res.status(400).json({
            status: 400, message: "El vehiculo ya ha sido seleccionado"
        });

        if (vehicleFound.id_type.toString() != typeDistributionFound._id.toString())
            return res.status(202).json({ status: 202, message: "Vehiculo no valido" });

        if (vehicleOldFound.id_type.toString() != typeDistributionFound._id.toString())
            return res.status(202).json({ status: 202, message: "Vehiculo no valido" });

        if (!assignTraysFound.status_free) return res.status(400).json({
            status: 400, message: "La asignacion ya ha sido seleccionada"
        });

        await Promise.all([
            AssignTraysVehicles.findByIdAndUpdate(_id,
                { cant_trays, cant_trays_delivery: cant_trays, observation, id_vehicle: id_vehicle_new }),
            Vehicle.findByIdAndUpdate(id_vehicle_new, { status_assign: true }),
            Vehicle.findByIdAndUpdate(id_vehicle_old, { status_assign: false })
        ]);

        return res.status(201).json({
            status: 201,
            message: "Asignacion de charolas modificado correctamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const deleteAssignTraysVehiclesById = async (req, res) => {
    try {
        const _id = req.params.assignTraysId;

        const [assignTraysFound] = await Promise.all([
                AssignTraysVehicles.findById({ _id }),
            ]);

        if (!assignTraysFound) return res.status(400).json({
            status: 400, message: "Asignacion de charolas no encontrado"
        });

        if (!assignTraysFound.status_free) return res.status(400).json({
            status: 400, message: "La asignacion ya ha sido seleccionada"
        });

        await Promise.all([
            AssignTraysVehicles.findByIdAndDelete(_id),
            Vehicle.findByIdAndUpdate(assignTraysFound['id_vehicle'], { status_assign: false }),
        ]);

        return res.status(201).json({
            status: 201,
            message: "Asignacion de charolas eliminada correctamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}


module.exports = {
    getAssignTraysVehiclesWithOutSupermarket,
    getAssignTraysVehiclesWithSupermarket,
    postAsignTraysVehicles,
    putAssignTraysVehicles,
    deleteAssignTraysVehiclesById
}