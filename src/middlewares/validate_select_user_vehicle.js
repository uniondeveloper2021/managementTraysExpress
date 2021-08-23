const Day = require('../models/day.model')
const User = require('../models/user.model')
const Role = require('../models/role.model')
const Vehicle = require('../models/vehicle.model')
const AssignTrayVehicle = require('../models/assign_trays_vehicles.model')
const TypeUserVehicle = require('../models/type_user_vehicle.model')

const verifySelectUserVehicle = async (req, res, next) => {
    try {
        const { id_user_agent, id_user_auxiliar, id_vehicle, number_day } = req.body;

        const query = { id_vehicle: id_vehicle, status_free: true, status_using: true }

        const [userAgentFound, userAuxiliarFound, roleAgentFound, roleAuxiliarFound,
            vehicleFound, typeDistributionFound, assignByIdVehicle, dayFound]
            = await Promise.all([
                User.findById(id_user_agent),
                User.findById(id_user_auxiliar),
                Role.findOne({ name: "SUPMARK_AGENT_ROLE" }),
                Role.findOne({ name: "ASSISTANT_ROLE" }),
                Vehicle.findById(id_vehicle),
                TypeUserVehicle.findOne({ name: "Distribucion" }),
                AssignTrayVehicle.findOne(query),
                Day.findOne({ number: number_day })
            ]);
            
        if (userAgentFound.id_role.toString() != roleAgentFound._id.toString())
            return res.status(202).json({ status: 202, message: "Usuario agente no valido" });

        if (userAuxiliarFound.id_role.toString() != roleAuxiliarFound._id.toString())
            return res.status(202).json({ status: 202, message: "Usuario auxiliar no valido" });

        if (vehicleFound.id_type.toString() != typeDistributionFound._id.toString())
            return res.status(202).json({ status: 202, message: "Vehiculo no valido" });

        if (!dayFound)
            return res.status(202).json({ status: 202, message: "El dia no existe" })

        if (!userAgentFound)
            return res.status(202).json({ status: 202, message: "El usuario agente no existe" })

        if (!userAgentFound.status_free)
            return res.status(202).json({
                status: 202, message: "No puede seleccionar otro vehiculo " +
                    "porque ahora usted cuenta con uno."
            })

        if (!userAuxiliarFound)
            return res.status(202).json({ status: 202, message: "El usuario auxiliar no existe" })

        if (!userAuxiliarFound.status_free)
            return res.status(202).json({ status: 202, message: "El auxiliar no esta libre" })

        if (!roleAgentFound)
            return res.status(202).json({ status: 202, message: "El rol agente no existe" })

        if (!roleAuxiliarFound)
            return res.status(202).json({ status: 202, message: "El rol auxiliar no existe" })

        if (!vehicleFound)
            return res.status(202).json({ status: 202, message: "El vehiculo no existe" })

        if (!vehicleFound.status_free)
            return res.status(202).json({ status: 202, message: "El vehiculo no esta libre" })

        if (!assignByIdVehicle)
            return res.status(202).json({ status: 202, message: "El vehiculo no tiene una asignacion disponible" })

        if (!vehicleFound.status_assign)
            return res.status(202).json({ status: 202, message: "El vehiculo no tiene charolas asignadas" })

        await Promise.all([
            Vehicle.findByIdAndUpdate(id_vehicle, { status_free: false }),
            User.findByIdAndUpdate(id_user_agent, { status_free: false }),
            User.findByIdAndUpdate(id_user_auxiliar, { status_free: false }),
            AssignTrayVehicle.findByIdAndUpdate(assignByIdVehicle._id,
                { id_user_supermark: id_user_agent, status_free: false })
        ]);

        req.params.assignByIdVehicleId = assignByIdVehicle._id;
        req.params.id_day = dayFound._id;
        req.params.cant_trays = assignByIdVehicle.cant_trays;
        next();
    }
    catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    verifySelectUserVehicle
}