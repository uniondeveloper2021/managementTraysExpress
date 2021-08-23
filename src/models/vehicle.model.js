const { Schema, model } = require('mongoose');

const vehicleSchema = new Schema({
    img_url: String,
    placa: String,
    status: Boolean,
    status_free: Boolean,
    status_assign: Boolean,
    date: String,
    id_type: {
        ref: "TypeUserVehicle",
        type: Schema.Types.ObjectId,
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = model('Vehicle', vehicleSchema);
