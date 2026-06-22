// Configuración de Multer en memoria

const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = file.originalname.toLowerCase();
        if (ext.endsWith(".pdf") || ext.endsWith(".xml")) {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten archivos PDF o XML"));
        }
    }
});

module.exports = upload;