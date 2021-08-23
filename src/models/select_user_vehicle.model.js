const { Schema, model } = require('mongoose');

const selectUserVehicleSchema = new Schema({
    number_km_output: Number,
    img_url_km_output: String,
    date_output: Date,
    observation_output: String,
    number_km_return: Number,
    img_url_km_return: String,
    date_return: String,
    observation_return: String,
    status: Boolean,
    status_active: Boolean,
    date: Date,
    id_user_agent: {
        ref: "User",
        type: Schema.Types.ObjectId,
    },
    id_user_auxiliar: {
        ref: "User",
        type: Schema.Types.ObjectId,
    },
    id_day: {
        ref: "Day",
        type: Schema.Types.ObjectId,
    },
    id_vehicle: {
        ref: "Vehicle",
        type: Schema.Types.ObjectId,
    },
    id_assign_trays_vehicles: {
        ref: "AssignTraysVehicles",
        type: Schema.Types.ObjectId,
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = model('SelectUserVehicle', selectUserVehicleSchema);
