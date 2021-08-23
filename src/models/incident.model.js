const { Schema, model } = require('mongoose');

const incidentSchema = new Schema({
    name: String,
    status: Boolean,
    date: String,
},
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model('Incident', incidentSchema);