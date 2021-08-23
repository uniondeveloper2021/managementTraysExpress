const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
    {
        dni: String,
        driverss_license: String,
        first_name: String,
        last_name: String,
        username: String,
        password: String,
        email: String,
        img_url: String,
        date: String,
        status: Boolean,
        status_free: Boolean,
        status_isRoute: Boolean,
        id_role: {
            ref: "Role",
            type: Schema.Types.ObjectId,
        },
        id_type: {
          ref: "TypeUserVehicle",
          type: Schema.Types.ObjectId,
      },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

userSchema.methods.toJSON = function() {
    const { __v, password, ...user } = this.toObject();
    // usuario.uid = _id;
    return user;
  }
  
userSchema.statics.encryptPassword = async (password) => {
    // encriptando el password y colocando el numero de saltos
    const salt = await bcrypt.genSalt(10);
    const passwordEncrypted = await bcrypt.hash(password, salt);
    return passwordEncrypted;
};
  
  userSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
  };

module.exports = model('User', userSchema);