const RegistroEnvio = require("../models/ModeloRegistro");

//obtener registros

const obtenerRegistro = async (req, res) => {

    try {

        const registros = await RegistroEnvio.find().sort({ fecha: -1 });
        return res.status(200).json(registros);

    } catch (error) {

        return res.status(500).json({ mensaje: "Error al obtener registros", error: error.message });

    }
}


//eliminar registros por id

const eliminarRegistro = async (req, res) => {

    try {

        const { id } = req.params;
        const resultado = await RegistroEnvio.findByIdAndDelete(id);

        if (!resultado) {
            return res.status(404).json({ mensaje: "Registro no encontrado" });

        }


        return res.status(200).json({ mensaje: "Registro eliminado correctamente" });


    } catch (error) {


        return res.status(500).json({ mensaje: "Error al eliminar registro", error: error.message });

    }
}


//eliminar todos los registros 

const eliminarTodosRegistro = async (req, res) => {

    try {

    await RegistroEnvio.deleteMany({});
    return res.status(200).json({ mensaje: "Todos los registros eliminados correctamente" });

    } catch (error) {

    return res.status(500).json({ mensaje: "Error al eliminar todos los registros", error: error.message });

    }
}


module.exports = { 
obtenerRegistro, 
eliminarRegistro,
eliminarTodosRegistro 
 };