const mongoose = require("mongoose");

const RegistroEnvioSchema = new mongoose.Schema({


    nombre: {
        type: String,
        required: true,
        trim: true
    },


    correo: {
        type: String,
        required: true,
        trim: true
    },


    archivos: [{ nombre: String }],


    fecha: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("RegistroEnvio", RegistroEnvioSchema, "RegistroEnvio");