const TypeUserVehicle = require('../models/type_user_vehicle.model')

const getTypeUserVehicle = async (req, res) => {
    try {
        const query = { status: true }
        const [total, typeUserVehicles] = await Promise.all([
            TypeUserVehicle.countDocuments(query),
            TypeUserVehicle.find(query)
        ])
        return res.status(201).json({ status: 201, total, data: typeUserVehicles,
            message: "Tipos listados satisfactoriamente" });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const postTypeUserVehicle = async (req, res) => {
    try {
        const { name } = req.body;
        const newTypeUserVehicle = new TypeUserVehicle({
            name, status: true
        })
        const typeUserVehicleFound = await TypeUserVehicle.findOne({ name: name })
        if (typeUserVehicleFound)
            return res.status(202).json({ status: 202, message: "Ese tipo ya existe" });
        const typeUserVehicleSaved = await newTypeUserVehicle.save();
        return res.status(201).json({ status: 201, data: typeUserVehicleSaved,
            message: "Tipo creado satisfactoriamente" });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const searchUserByName = async (req, res) => {
    try {
        const name = req.params.name;
        const typeUserVehicleFound = await TypeUserVehicle.find({
            name: { $regex: name }
        });
        if (!typeUserVehicleFound) return res.status(400).json({ status: 400,
            message: "El tipo no se encuentra en la base de datos", });

        return res.status(201).json({ status: 201, data: typeUserVehicleFound,
            message: "Tipo encontrado satisfactoriamente" });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const updateTypeById = async (req, res) => {
    try {
        const _id = req.params.vehicleId;
        const { name } = req.body;
        const typeUserVehicleFound = await TypeUserVehicle.findById({ _id })
        if (!typeUserVehicleFound) return res.status(400).json({ status: 400,
            message: "Vehicle no encontrado" });
        await TypeUserVehicle.findByIdAndUpdate(_id, { name: name });
        return res.status(201).json({ status: 201, message: "Tipo modificado correctamente" });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    postTypeUserVehicle,
    getTypeUserVehicle,
    searchUserByName,
    updateTypeById
}