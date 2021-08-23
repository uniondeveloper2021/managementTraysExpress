const { Schema, model } = require('mongoose');

const establishmentSchema = new Schema({
        name: String,
        direction: String,
        ean: String,
        reception_hours: String,
        status: Boolean,
        status_free: Boolean,
        status_is_delivery: Boolean,
        img_url: String,
        cant_trays: Number,
        date: String,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model('Establishment', establishmentSchema);