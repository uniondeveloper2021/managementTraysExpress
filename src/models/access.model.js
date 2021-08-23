const { Schema, model } = require('mongoose');

const accessSchema = new Schema(
    {
        name: String,
        path: String,
        icon: String,
        status: Boolean
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model('Acceso', accessSchema);