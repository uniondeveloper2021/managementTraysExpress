const Access = require('../models/access.model')

const postAccess = async (req, res) => {
    try {
        const { name, path, icon } = req.body;
        const newAccess = await new Access({
            name, path, icon, status: true
        })
        const [nameFound, pathFound] = await Promise.all([
            Access.findOne({ name: name }),
            Access.findOne({ path: path })
        ])

        if (nameFound)
            return res.status(202).json({ status: 202,
                message: "El nombre ya existe" })
        if (pathFound)
            return res.status(202).json({ status: 202,
                message: "La ruta ya existe" })

        const accessSaved = await newAccess.save();
        return res.status(201).json({ status: 201, data: accessSaved,
            message: "Acceso creado satisfactoriamente" });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " +  error });
    }
}

const getAccess = async (req, res) => {
    try {
        const query = { status: true }
        const [total, access] = await Promise.all([
            Access.countDocuments(query),
            Access.find(query)
        ])
        return res.status(201).json({ status: 201, total, data: access,
            message: "Todos los accesos disponibles" });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    postAccess,
    getAccess
}