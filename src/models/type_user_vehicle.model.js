const { Schema, model } = require('mongoose');

const typeUserVehicleSchema = new Schema({
    name: String,
    status: Boolean,
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = model('TypeUserVehicle', typeUserVehicleSchema);