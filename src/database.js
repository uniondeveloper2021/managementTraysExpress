const mongoose = require("mongoose");
const dbConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://uniondeveloper:uniondeveloper2021$$@cluster0.9xkag.mongodb.net/managementcharolas?retryWrites=true&w=majority&ssl=true",
      {
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