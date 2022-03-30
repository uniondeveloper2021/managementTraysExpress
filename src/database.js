const mongoose = require("mongoose");
const dbConnection = async () => {
  try {
    mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    },
      (err, res) => {
        if (err) throw err;
        console.log("Base de Datos ONLINE");
      }
    );
  } catch (error) {
    throw new Error("Error en la base de datos: ", error);
  }
};

module.exports = {
  dbConnection
}