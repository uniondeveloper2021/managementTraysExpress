const { Schema, model } = require('mongoose');

const assigntraysvehiclesSchema = new Schema({
    date: Date,
    placa: String,
    cant_trays: Number,
    cant_trays_delivery: Number,
    cant_trays_undelivery: Number,
    observation: String,
    status: Boolean,
    status_free: Boolean,
    status_using: Boolean,
    id_user_controller: {
        ref: "User",
        type: Schema.Types.ObjectId,
    },
    id_user_supermark: {
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
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = model('AssignTraysVehicles', assigntraysvehiclesSchema);
