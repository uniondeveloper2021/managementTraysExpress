const { Schema, model } = require('mongoose');

const daySchema = new Schema(
    {
        day: String,
        number: Number,
        status: Boolean
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model('Day', daySchema);