const { Schema, model } = require('mongoose');

const vehicleControlSchema = new Schema({
    number_km_output: Number,
    img_url_km_output: String,
    number_km_return: Number,
    img_url_km_return: String,
    mechanical_assistance: Boolean,
    observation: String,
    url_img_km: String,
    date: String,
    status: Boolean,
    status_available: Boolean,
    id_user_bodega: {
        ref: "User",
        type: Schema.Types.ObjectId,
    },
    id_vehicle: {
        ref: "Vehicle",
        type: Schema.Types.ObjectId,
    }
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = model('VehicleControl', vehicleControlSchema);