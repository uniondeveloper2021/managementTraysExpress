const { Schema, model } = require('mongoose');

const roleSchema = new Schema(
    {
        name: String,
        status: Boolean
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model('Role', roleSchema);