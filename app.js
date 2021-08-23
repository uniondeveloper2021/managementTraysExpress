const express = require("express");
const { dbConnection } = require("./src/database");
const authRoutes = require("./src/routes/auth.routes.js")
const userRoutes = require("./src/routes/user.routes.js")
const vehiclesRoutes = require("./src/routes/vehicle.routes")
const establishmentRoutes = require("./src/routes/establishment.routes")
const incidentRoutes = require("./src/routes/incident.routes")
const typeUserVehicleRoutes = require("./src/routes/type_user_vehicle.routes")
const vehicleControlRoutes = require("./src/routes/vehicle_control.routes")
const routeRoutes = require("./src/routes/routes.routes")
const selectUserVehicleRoutes = require("./src/routes/select_user_vehicle.routes")
const establishmentRouteRoutes = require("./src/routes/establishment_routes.routes")
const assignTraysVehiclesRoutes = require("./src/routes/assign_trays_vehicles.routes")
const deliveryTraysEstablishmentRoutes = require("./src/routes/delivery_trays_establishments.routes")
const technicalSupportRoutes = require("./src/routes/technical.support.routes")

const bodyParser = require("body-parser");

const version_api = '/v1/api'
const connect = async () => {
    await dbConnection();
};

connect();
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000)

app.use(`${version_api}/auth`, authRoutes);
app.use(`${version_api}/users`, userRoutes);
app.use(`${version_api}/vehicle`, vehiclesRoutes);
app.use(`${version_api}/incident`, incidentRoutes);
app.use(`${version_api}/establishment`, establishmentRoutes);
app.use(`${version_api}/type-user-vehicle`, typeUserVehicleRoutes);
app.use(`${version_api}/vehicle-control`, vehicleControlRoutes);
app.use(`${version_api}/route`, routeRoutes);
app.use(`${version_api}/select-user-vehicle`, selectUserVehicleRoutes);
app.use(`${version_api}/establishment-route`, establishmentRouteRoutes);
app.use(`${version_api}/assign-trays-vehicles`, assignTraysVehiclesRoutes);
app.use(`${version_api}/delivery-trays-establ`, deliveryTraysEstablishmentRoutes);
app.use(`${version_api}/technical-support`, technicalSupportRoutes);

module.exports = app;