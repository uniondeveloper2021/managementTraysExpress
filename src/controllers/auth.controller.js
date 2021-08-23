const Role = require('../models/role.model')
const AssignTrayVehicle = require('../models/assign_trays_vehicles.model')
const signIn = async (req, res) => {
    try {
        let cant_trays;
        const id_role = req.userFound[0].id_role;
        console.log(req.userFound[0]._id);
        const [roleFound, assignFound] = await Promise.all([
            Role.findById(id_role),
            AssignTrayVehicle.findOne({ id_user_supermark: req.userFound[0]._id,
                status_free: false, status_using: true })
        ])

        roleFound.name == 'SUPMARK_AGENT_ROLE' && assignFound ?
            cant_trays = assignFound.cant_trays_delivery :
            cant_trays = 0;

        return res.status(201).json({
            status: 201, token: req.token, rutas: req.accesos,
            user: req.userFound, cantTraysDelivery: cant_trays,
            message: 'Usuario logueado satisfactoriamente'
        })
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error : " + error });
    }
}

const refreshToken = async (req, res) => {
    try {
        let cant_trays;
        const id_role = req.userFound[0].id_role;
        const [roleFound, assignFound] = await Promise.all([
            Role.findById(id_role),
            AssignTrayVehicle.findOne({ id_user_supermark: req.userFound[0]._id,
                status_free: false, status_using: true })
        ])
        roleFound.name == 'SUPMARK_AGENT_ROLE' && assignFound ?
            cant_trays = assignFound.cant_trays_delivery :
            cant_trays = 0;

        return res.status(201).json({
            status: 201, token: req.token, rutas: req.accesos,
            user: req.userFound, cantTraysDelivery: cant_trays,
            message: 'Token renovado correctamente'
        })
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    signIn,
    refreshToken
}