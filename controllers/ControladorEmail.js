const nodemailer = require("nodemailer");
const createTransporter = require("../config/ConfigEmail");

const Enviarcorreo = async (req, res) => {

  try {
    const { nombre, correo, comentarios } = req.body;

    if (!correo || !nombre) {
      return res.status(400).json({ mensaje: "El correo y el nombre son obligatorios" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ mensaje: "Debes adjuntar al menos un archivo PDF/XML" });
    }

 console.log("Body:", req.body);
console.log("Files:", req.files);

    const archivos = req.files.map(file => ({
      filename: file.originalname,
      content: file.buffer,
      mimetype: file.mimetype
    }));

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: "no-reply@local-app.com",
      to: correo,
      subject: `Archivos para ${nombre}`,
      text: comentarios || "Se adjuntan los archivos solicitados",
      attachments: archivos
    });

    return res.status(200).json({
      mensaje: "✅ Correo enviado exitosamente",
      vista: nodemailer.getTestMessageUrl(info)
    });
  } catch (error) {
    return res.status(500).json
    ({ mensaje: "❌ Error al enviar el correo", 
       error: error.message ,
       stack: error.stack


    });
  }
};

module.exports = { Enviarcorreo };
