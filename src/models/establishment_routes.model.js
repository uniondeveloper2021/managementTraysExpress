const { Schema, model } = require('mongoose');

const establishmentRouteSchema = new Schema({
    status: Boolean,
    status_is_delivery: Boolean,
    date: String,
    id_user_agent: {
        ref: "User",
        type: Schema.Types.ObjectId,
    },
    id_route: {
        ref: "Route",
        type: Schema.Types.ObjectId,
    },
    id_establishment: {
        ref: "Establishment",
        type: Schema.Types.ObjectId,
    },
    id_day: {
        ref: "Day",
        type: Schema.Types.ObjectId,
    }
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = model('EstablishmentRoute', establishmentRouteSchema);