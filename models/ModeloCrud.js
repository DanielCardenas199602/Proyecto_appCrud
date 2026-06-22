const mongoose = require("mongoose"); //importamos mongoose para definir el esquema y modelo de la base de datos


// función para quitar acentos
function quitarAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const CorreoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    set: (valor) => quitarAcentos(valor) // 👈 quita acentos automáticamente al guardar
  },
  correo: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Formato de correo inválido"]
  },
  comentarios: {
    type: String,
    trim: true,
    required: false // 👈 opcional

  }
});

// Exportar el modelo
module.exports = mongoose.model("ProyectoContador", CorreoSchema, "ProyectoContador");