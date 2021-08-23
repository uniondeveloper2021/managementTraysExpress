const Incident = require('../models/incident.model')

const postIncident = async (req, res) => {
    const { name } = req.body
    const newIncident = new Incident({ name, status: true });
    try {
        const incidentFound = await Incident.findOne({ name: name });
        if (incidentFound) res.status(202).json({ status: 202,
            message: "El incidente ya existe" })
        const incidentSaved = await newIncident.save();

        return res.status(201).json({ status: 201, data: incidentSaved,
            message: "Incidente creado satisfactoriamente" });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getIncidents = async (req, res) => {
    try {
        const query = { status: true }
        const [total, incidents] = await Promise.all([
            Incident.countDocuments(query),
            Incident.find(query)
        ])
        return res.status(201).json({ status: 201, total, data: incidents,
            message: "Todos los incidentes disponibles" });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const searchIncidentByName = async (req, res) => {
    try {
        const name = req.params.name;
        const incidentFound = await Incident.find({
            name: { $regex: name }
        });

        if (!incidentFound)
            return res.status(400).json({ status: 400,
                message: "El incidente no se encuentra en la base de datos" });

        return res.status(201).json({ status: 201, data: incidentFound,
            message: "Incidente encontrado satisfactoriamente" });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const updateIncidentById = async (req, res) => {
    try {
        const _id = req.params.incidentId;
        const { name } = req.body;
        const incidentFound = await Incident.findById({ _id })
        if (!incidentFound) return res.status(400).json({ status: 400,
            message: "Incidente no encontrado" });

        await Incident.findByIdAndUpdate(_id, { name: name });
        
        return res.status(201).json({ status: 201,
            message: "Incidente modificado correctamente" });
    
        } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const deleteIncidentById = async (req, res) => {
    try {
        const _id = req.params.incidentId;
        await Incident.findByIdAndUpdate(_id, { status: false });
        return res.status(201).json({ status: 201,
            message: "Incidente eliminado correctamente" });
            
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    postIncident,
    getIncidents,
    searchIncidentByName,
    updateIncidentById,
    deleteIncidentById
}