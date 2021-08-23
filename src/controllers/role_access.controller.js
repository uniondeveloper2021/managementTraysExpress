const Role = require('../models/role.model')
const RoleAccess = require('../models/role_access.model')
const Access = require('../models/access.model')

const postRoleAccess = async (req, res) => {
    try {
        const { id_role, id_access } = req.body
        const newRoleAccess = await new RoleAccess({
            id_role, id_access
        })
        const [roleFound, accessFound] = await Promise.all([
            Role.findById(id_role),
            Access.findById(id_access)
        ])

        if (!roleFound) return res.status(202).json({
            status: 202, message: "El rol no existe" })
        
        if (!accessFound) return res.status(202).json({
        status: 202, message: "El acceso no existe" })
        const roleAccessSaved = await newRoleAccess.save();
        
        return res.status(201).json({
            status: 201, data: roleAccessSaved,
            message: "Rol acceso creado satisfactoriamente"
        });

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    postRoleAccess
}