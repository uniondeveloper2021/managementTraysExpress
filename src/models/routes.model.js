const { Schema, model } = require('mongoose');

const routesSchema = new Schema({
    name: String,
    number: Number,
    status: Boolean,
    status_free: Boolean,
    date: String,
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = model('Route', routesSchema);