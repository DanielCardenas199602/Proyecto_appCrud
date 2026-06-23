const{conexion} = require("./database/conexion");
const express = require("express");
const cors = require("cors");
const path = require("path");//para manejar rutas de archivos
require("dotenv").config(); //  carga las variables del .env

//inicializar la app de node

console.log("app de node arrancada");


//conectar a la base de datos

conexion();

//crear servidor de node y escuchar peticiones http
const app = express();
const puerto = process.env.RAILWAY_TCP_PROXY_PORT || process.env.PORT || 3300;

// configurar cors
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));// para manejar datos enviados desde el frontend en formato JSON y URL-encoded

//exportacion de rutas 

const RutaProyecto = require("./routes/rutas");

// CRUD bajo este prefijo
app.use("/api/Ruta-Proyecto", RutaProyecto);

// Mailer bajo otro prefijo
app.use("/api/Ruta-EnviarCorreo", RutaProyecto );


// Exponer API_URL al frontend (dinámico desde .env)


//Servir archivos estáticos (frontend)  
app.use(express.static(path.join(__dirname, "public")));// para servir los archivos estáticos del frontend desde la carpeta "public"

//crear servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`)
});











