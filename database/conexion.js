const mongoose = require('mongoose');
require('dotenv').config();


const conexion = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Usa la variable del .env
        console.log('Conexión a la base de datos establecida');
    } catch (error) {
        console.error(' Error al conectar a la base de datos:', error);
        throw new Error('Error al conectar a la base de datos');
    }
}

module.exports = { conexion };