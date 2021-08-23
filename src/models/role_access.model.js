const { Schema, model } = require('mongoose');

const roleAccessSchema = new Schema({
    id_role: {
        ref: "Role",
        type: Schema.Types.ObjectId,
    },
    id_access: {
        ref: "Acceso",
        type: Schema.Types.ObjectId,
    },
    
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = model('RoleAcceso', roleAccessSchema);