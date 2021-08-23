const Establishment = require('../models/establishment.model')

const postEstablishment = async (req, res) => {
    try {
        const { name, direction, ean, reception_hours, cant_trays } = req.body;
        const newEstablishment = new Establishment({
            name, direction, ean, reception_hours, status: true,
            cant_trays, status_free: true, status_is_delivery: false,
            img_url: 'https://res.cloudinary.com/developer-union/image/upload/v1628797418/charolas/local_lcu5gy.png'
        })

        const establishmentFound = await Establishment.findOne({ name: name })

        if (establishmentFound) return res.status(202).json({
            status: 202,
            message: "El establecimiento ya existe"
        })
        const establishmentSaved = await newEstablishment.save();

        return res.status(201).json({
            status: 201, data: establishmentSaved,
            message: "Establecimiento creado satisfactoriamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getEstablishment = async (req, res) => {
    try {
        const query = { status: true }
        const [total, establishment] = await Promise.all([
            Establishment.countDocuments(query),
            Establishment.find(query)
        ])
        return res.status(201).json({
            status: 201, total, data: establishment,
            message: "Todos los establecimientos disponibles"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

// listar establecimientos que estan designados en una ruta
const getEstablishmentAppointed = async (req, res) => {
    try {
        const query = { status_free: false }
        const [total, establishment] = await Promise.all([
            Establishment.countDocuments(query),
            Establishment.find(query)
        ])
        return res.status(201).json({
            status: 201, total, data: establishment,
            message: "Todos los establecimientos que estan asignados a una ruta"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getEstablishmentNotAppointed = async (req, res) => {
    try {
        const query = { status_free: true }
        const [total, establishment] = await Promise.all([
            Establishment.countDocuments(query),
            Establishment.find(query)
        ])
        return res.status(201).json({
            status: 201, total, data: establishment,
            message: "Todos los establecimientos que no estan asignados a una ruta"
        });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

// TODO: cuando un establecimiento se registra en una ruta, colocar su status a false
const updateEstablishmentStatusFreeToFalse = async (req, res) => {
    try {
        const _id = req.params.establishmentId;
        const establishmentFound = await Establishment.findById({ _id })

        if (!establishmentFound) return res.status(400).json({
            status: 400, message: "Establecimiento no encontrado"
        });

        await Establishment.findByIdAndUpdate(_id, { status_free: false });

        res.status(201).json({
            status: 201,
            message: "Establicimiento modificado correctamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const searchEstablishmentByName = async (req, res) => {
    try {
        const name = req.params.name;
        const establishmentFound = await Establishment.find({
            name: { $regex: name }
        });

        if (!establishmentFound)
            return res.status(400).json({
                status: 400,
                message: "El establecimiento no se encuentra en la base de datos"
            });

        return res.status(201).json({
            status: 201, data: establishmentFound,
            message: "Establecimiento encontrado satisfactoriamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const updateEstablishmentById = async (req, res) => {
    try {
        const _id = req.params.establishmentId;
        const { name } = req.body;
        const establishmentFound = await Establishment.findById({ _id })

        if (!establishmentFound) res.status(400).json({
            status: 400,
            message: "Establecimiento no encontrado"
        });

        await Establishment.findByIdAndUpdate(_id, { name: name });

        return res.status(201).json({
            status: 201,
            message: "Establicimiento modificado correctamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const updateEstablishmentByIdStatusInDeliveryToFalse = async (req, res) => {
    try {
        const _id = req.params.establishmentId;
        const establishmentFound = await Establishment.findById({ _id })

        if (!establishmentFound) return res.status(400).json({
            status: 400, message: "Establecimiento no encontrado"
        });

        await Establishment.findByIdAndUpdate(_id, { status_is_delivery: false });

        res.status(201).json({
            status: 201,
            message: "Establicimiento modificado correctamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const deleteEstablishmentById = async (req, res) => {
    try {
        const _id = req.params.establishmentId;
        await Establishment.findByIdAndUpdate(_id, { status: false });
        return res.status(201).json({
            status: 201,
            message: "Establecimiento eliminado correctamente"
        });
    } catch (error) {
        res.status(400).json({ status: 400, message: error });
    }
}

module.exports = {
    postEstablishment,
    getEstablishment,
    searchEstablishmentByName,
    updateEstablishmentById,
    deleteEstablishmentById,
    getEstablishmentAppointed,
    getEstablishmentNotAppointed,
    updateEstablishmentByIdStatusInDeliveryToFalse,
    updateEstablishmentStatusFreeToFalse
}