const express = require("express");//importamos express para crear el router y manejar las rutas
const router = express.Router();//creamos el router para definir las rutas de la API
const multer = require("multer");//importamos multer para manejar la subida de archivos
const path = require("path");//importamos path para manejar rutas de archivos


const ProyectController = require("../controllers/ControladorCrud");//importamos el controlador para manejar la lógica de las rutas
const upload = require("../middlewares/uploads");
const { Enviarcorreo } = require("../controllers/ControladorEmail");//importamos el controlador para manejar la lógica de las rutas de correo
const { obtenerRegistros, eliminarRegistro, eliminarTodosRegistros } = require("../controllers/ContrladorRegistro");


// Ruta GET de prueba
router.get("/prueba", ProyectController.prueba);
router.post("/crear", ProyectController.CrearCorreo);
router.get("/consultarPorNombre/:nombre", ProyectController.consultarPorNombre);
router.delete("/eliminarPorNombre/:nombre", ProyectController.eliminarPorNombre);
router.put("/actualizarPorNombre/:nombre", ProyectController.ActualizarPorNombre);


router.post("/enviarCorreo", upload.array("archivos"), Enviarcorreo);


//nuevas rutas de registros de envío
router.get("/registros", obtenerRegistro);
router.delete("/registros/:id", eliminarRegistro);
router.delete("/registros", eliminarTodosRegistros);


//EXPORTAMOS RUTAS

module.exports = router;