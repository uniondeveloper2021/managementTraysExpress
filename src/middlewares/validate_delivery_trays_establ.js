const User = require('../models/user.model')
const Role = require('../models/role.model')
const Establishment = require('../models/establishment.model')
const Incident = require('../models/incident.model')
const Day = require('../models/day.model')
const Vehicle = require('../models/vehicle.model')
const AssignTrayVehicle = require('../models/assign_trays_vehicles.model')
const EstablishmentRoutes = require('../models/establishment_routes.model.js')
const SelectUserVehicle = require('../models/select_user_vehicle.model')

const verifyDeliveryTraysEstablishment = async (req, res, next) => {
    try {
        const { trays_delivered, collected_trays, id_user_agent, id_establishment,
            id_incident, number_day } = req.body;

        const query = { id_user_supermark: id_user_agent, status_free: false, status_using: true }

        const [userFound, roleFound, establishmentFound, incidentFound,
            establishmentRoutesFound, assignByIdVehicle, dayFound]
            = await Promise.all([
                User.findById(id_user_agent),
                Role.findOne({ name: "SUPMARK_AGENT_ROLE" }),
                Establishment.findById(id_establishment),
                Incident.findById(id_incident),
                EstablishmentRoutes.findOne({ id_establishment: id_establishment }),
                AssignTrayVehicle.findOne(query),
                Day.findOne({ number: number_day }),
            ]);

        if (!establishmentRoutesFound) return res.status(202).json({
            status: 202, message: "El establecimiento no se encuentra en la ruta"
        });

        if (establishmentRoutesFound["id_user_agent"].toString() != id_user_agent.toString())
            return res.status(202).json({
                status: 202, message: "El establecimiento no le pertecene"
            });

        if (establishmentRoutesFound.id_day.toString() != dayFound._id.toString())
            return res.status(202).json({
                status: 202, message: "El establecimiento no se encuentra en su ruta del dia de hoy"
            });

        if (!userFound)
            return res.status(202).json({ status: 202, message: "El usuario no existe" });

        if (userFound.status_free)
            return res.status(202).json({ status: 202, message: "El usuario no es valido" });

        if (!assignByIdVehicle)
            return res.status(202).json({ status: 202, message: "El vehiculo no tiene una asignacion disponible" });

        if (id_user_agent != assignByIdVehicle.id_user_supermark)
            return res.status(202).json({ status: 202, message: "El vehiculo no le pertenece" });

        if (!dayFound)
            return res.status(202).json({ status: 202, message: "El dia no existe" });

        if (!roleFound)
            return res.status(202).json({ status: 202, message: "El rol no existe" });

        if (!establishmentFound)
            return res.status(202).json({ status: 202, message: "El establecimiento no existe" });

        if (establishmentFound.status_is_delivery)
            return res.status(202).json({
                status: 202, message: "Ya se entrego/recogio charolas en el establecimiento"
            });

        const [vehicleFound, selectUserVehicleFound] = await Promise.all([
            Vehicle.findById(assignByIdVehicle.id_vehicle),
            SelectUserVehicle.findOne({ status_active: true, id_user_agent })
        ]);

        if (!selectUserVehicleFound || selectUserVehicleFound.id_day.toString() != dayFound._id.toString())
            return res.status(202).json({
                status: 202, message: "No puede entregar/recoger charolas porque el vehiculo que tiene seleccionado es de otro dia"
            });

        if (!vehicleFound)
            return res.status(202).json({ status: 202, message: "El vehiculo no existe" });

        if (!incidentFound)
            return res.status(202).json({ status: 202, message: "Incidente no encontrado" });

        const cant_trays_establishment = establishmentFound['cant_trays']; // 0

        console.log("establishmentFound['cant_trays']: " + establishmentFound['cant_trays']);

        const result = cant_trays_establishment + trays_delivered - collected_trays; // result = 0 + 0 - 0

        console.log("result: " + result);

        if (result < 0)
            return res.status(202).json({
                status: 202, message: `No puedes sacar ${collected_trays} charolas porque el establecimiento no cuenta con esa cantidad`
            });

        const total = assignByIdVehicle.cant_trays_delivery - trays_delivered + collected_trays;
        console.log("assignByIdVehicle.cant_trays_delivery: " + assignByIdVehicle.cant_trays_delivery);
        console.log("trays_delivered: " + trays_delivered);
        console.log("collected_trays: " + collected_trays);
        console.log("total: " + total);
        if (total >= 0) {
            await Promise.all([
                AssignTrayVehicle.findByIdAndUpdate(assignByIdVehicle._id,
                    { cant_trays_delivery: total }),
                Establishment.findByIdAndUpdate(establishmentFound._id,
                    { cant_trays: result })
            ])
            req.params.id_assign_trays_vehicle = assignByIdVehicle._id;
            req.params.id_day = dayFound._id;
            req.params.id_vehicle = vehicleFound._id;
            return next();
        }
        return res.status(202).json({ status: 202, message: "No puedes entregar mas charolas de las que no cuentas" });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

const verifyDeliveryTraysEstablishmentSunday = async (req, res, next) => {
    try {
        const { trays_delivered, collected_trays, id_user_agent, id_establishment,
            id_incident, number_day } = req.body;

        const query = { id_user_supermark: id_user_agent, status_free: false, status_using: true }

        const [userFound, roleFound, establishmentFound, incidentFound, assignByIdVehicle, dayFound]
            = await Promise.all([
                User.findById(id_user_agent),
                Role.findOne({ name: "SUPMARK_AGENT_ROLE" }),
                Establishment.findById(id_establishment),
                Incident.findById(id_incident),
                AssignTrayVehicle.findOne(query),
                Day.findOne({ number: number_day }),
            ]);

        if (!userFound)
            return res.status(202).json({ status: 202, message: "El usuario no existe" });

        if (userFound.status_free)
            return res.status(202).json({ status: 202, message: "El usuario no es valido" });

        if (!assignByIdVehicle)
            return res.status(202).json({ status: 202, message: "El vehiculo no tiene una asignacion disponible" });

        if (id_user_agent != assignByIdVehicle.id_user_supermark)
            return res.status(202).json({ status: 202, message: "El vehiculo no le pertenece" });

        if (!dayFound)
            return res.status(202).json({ status: 202, message: "El dia no existe" });

        if (!roleFound)
            return res.status(202).json({ status: 202, message: "El rol no existe" });

        if (!establishmentFound)
            return res.status(202).json({ status: 202, message: "El establecimiento no existe" });

        const [vehicleFound, selectUserVehicleFound] = await Promise.all([
            Vehicle.findById(assignByIdVehicle.id_vehicle),
            SelectUserVehicle.findOne({ status_active: true, id_user_agent })
        ]);

        if (!selectUserVehicleFound || selectUserVehicleFound.id_day.toString() != dayFound._id.toString())
            return res.status(202).json({
                status: 202, message: "No puede entregar/recoger charolas porque el vehiculo que tiene seleccionado es de otro dia"
            });

        if (!vehicleFound)
            return res.status(202).json({ status: 202, message: "El vehiculo no existe" });

        if (!incidentFound)
            return res.status(202).json({ status: 202, message: "Incidente no encontrado" });

        const cant_trays_establishment = establishmentFound['cant_trays'];

        const result = cant_trays_establishment + trays_delivered - collected_trays;

        if (result < 0)
            return res.status(202).json({
                status: 202, message: `No puedes sacar ${collected_trays} charolas porque el establecimiento no cuenta con esa cantidad`
            });

        const total = assignByIdVehicle.cant_trays_delivery - trays_delivered + collected_trays;
        if (total >= 0) {
            await Promise.all([
                AssignTrayVehicle.findByIdAndUpdate(assignByIdVehicle._id,
                    { cant_trays_delivery: total }),
                Establishment.findByIdAndUpdate(establishmentFound._id,
                    { cant_trays: result })
            ])
            req.params.id_assign_trays_vehicle = assignByIdVehicle._id;
            req.params.id_day = dayFound._id;
            req.params.id_vehicle = vehicleFound._id;
            return next();
        }
        return res.status(202).json({ status: 202, message: "No puedes entregar mas charolas de las que no cuentas" });
    } catch (error) {
        return res.status(400).json({ status: 400, message: "Error: " + error });
    }
}

module.exports = {
    verifyDeliveryTraysEstablishment,
    verifyDeliveryTraysEstablishmentSunday
}