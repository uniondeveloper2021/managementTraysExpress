const Role = require('../models/role.model')

const createRole = async (req, res) => {
    try {
        const newRole = new Role({
            name: "BODEGUERO_ADMIN_ROLE", status: true
        })
        const roleSaved = await newRole.save();

        return res.status(201).json({ status: 201, data: roleSaved,
            message: "Rol creado satisfactoriamente" });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const getRoles = async (req, res) => {
    try {
        const query = { status: true }
        const [total, roles] = await Promise.all([
            Role.countDocuments(query),
            Role.find(query)
        ])
        return res.status(201).json({ status: 201, total, data: roles,
            message: "Todos los roles disponibles" });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    createRole,
    getRoles
}