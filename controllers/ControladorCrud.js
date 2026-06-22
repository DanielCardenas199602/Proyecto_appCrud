const Correo = require("../models/ModeloCrud");//importamos el modelo para poder interactuar con la base de datos



//controlador de prueba 

const prueba = (req, res) => {
  return res.status(200).json({
    mensaje: "Controlador de prueba funcionando 🚀",
    metodo: req.method,
    ruta: req.originalUrl
  });
};


//controlador para crear un nuevo correo

const CrearCorreo = async(req,res) => {

try {

    const {nombre, correo, comentarios} = req.body;

    // Validación básica
    if (!nombre || !correo) {
      return res.status(400).json({ mensaje: "Nombre y correo son obligatorios" });
    }

     // Validación de duplicados por correo
    const correoExistente = await Correo.findOne({ correo });
    if (correoExistente) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

      // Crear nuevo registro

    const nuevoCorreo = new Correo({ nombre, correo, comentarios });
    await nuevoCorreo.save();

    return res.status(201).json({
      mensaje: "Registro creado correctamente",
      data: nuevoCorreo
    });

    
} catch (error) {

    return res.status(500).json
    ({ mensaje: "Error al crear el registro", 
    error });
    
}



}


// Consultar por nombre
const consultarPorNombre = async (req, res) => {
  try {
    const nombre  = req.params.nombre
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const correo = await Correo.findOne({ nombre: new RegExp(`^${nombre}$`, "i") }); // búsqueda case-insensitive

    if (!correo) {
      return res.status(404).json({ mensaje: "No se encontró registro con ese nombre" });
    }

    return res.status(200).json(correo);
  } catch (error) {
    return res.status(500).json({ mensaje: "Error al consultar por nombre", error });
  }
};

// eliminar por nombre


const eliminarPorNombre = async (req, res) => {
  try {
    const nombre = req.params.nombre;

    const resultado = await Correo.deleteOne({ nombre: new RegExp(`^${nombre}$`, "i") }); // búsqueda case-insensitive

    if (resultado.deletedCount === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se encontró un usuario con ese nombre"
      });
    }

    return res.status(200).json({
      status: "success",
      mensaje: "Usuario eliminado correctamente",
      resultado
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al eliminar el usuario",
      error: error.message
    });
  }
};


//Actulizar por nombre 

const ActualizarPorNombre = async (req, res) => {
  try {
    const nombre = req.params.nombre;
    const { nombre: nuevoNombre, correo: nuevoCorreo } = req.body;

    // Validar duplicado de nombre, solo si viene un nuevo nombre
    if (nuevoNombre) {
      const nombreExistente = await Correo.findOne({ nombre: nuevoNombre });
      if (nombreExistente && nombreExistente.nombre !== nombre) {
        return res.status(400).json({
          status: "error",
          mensaje: "El nombre ya está en uso",
          nombreExistente: nombreExistente.nombre
        });
      }
    }

    // Validar duplicado de correo, solo si viene un nuevo correo
    if (nuevoCorreo) {
      const correoExistente = await Correo.findOne({ correo: nuevoCorreo });
      if (correoExistente && correoExistente.nombre !== nombre) {
        return res.status(400).json({
          status: "error",
          mensaje: "El correo ya está registrado",
          correoExistente: correoExistente.correo
        });
      }
    }

    // Construir solo los campos que vienen en el body
    const camposActualizar = {};
    if (nuevoNombre) camposActualizar.nombre = nuevoNombre;
    if (nuevoCorreo) camposActualizar.correo = nuevoCorreo;

    // Actualizar registro
    const actualizado = await Correo.findOneAndUpdate(
      { nombre },
      camposActualizar,
      { returnDocument: "after" }
    );

    if (!actualizado) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se encontró usuario con ese nombre"
      });
    }

    return res.status(200).json({
      status: "success",
      mensaje: "Usuario actualizado correctamente",
      data: actualizado
    });

  } catch (error) {
    console.error("ERROR REAL:", error);
    return res.status(500).json({
      status: "error",
      mensaje: "Error al actualizar el usuario",
      error: error.message
    });
  }
};




module.exports = {
  prueba,
  CrearCorreo,
  consultarPorNombre,
  eliminarPorNombre,
  ActualizarPorNombre

};