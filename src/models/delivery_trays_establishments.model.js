const { Schema, model } = require('mongoose');

const deliveryTraysEstablSchema = new Schema({
    trays_delivered: Number,
    collected_trays: Number,
    observation: String,
    status: Boolean,
    date: Date,
    id_user_agent: {
        ref: "User",
        type: Schema.Types.ObjectId,
    },
    id_establishment: {
        ref: "Establishment",
        type: Schema.Types.ObjectId,
    },
    id_incident: {
        ref: "Incident",
        type: Schema.Types.ObjectId,
    },
    id_vehicle: {
        ref: "Vehicle",
        type: Schema.Types.ObjectId,
    },
    id_day: {
        ref: "Day",
        type: Schema.Types.ObjectId,
    },
    id_assign_trays_vehicle: {
        ref: "AssignTraysVehicles",
        type: Schema.Types.ObjectId,
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = model('DeliveryTraysEstabl', deliveryTraysEstablSchema);
