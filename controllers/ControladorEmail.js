const { Resend } = require("resend");

const Enviarcorreo = async (req, res) => {
  try {
    const { nombre, correo, comentarios } = req.body;

    if (!correo || !nombre) {
      return res.status(400).json({ mensaje: "El correo y el nombre son obligatorios" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ mensaje: "Debes adjuntar al menos un archivo PDF/XML" });
    }

    const resend = new Resend(process.env.SMTP_PASS);

    const attachments = req.files.map(file => ({
      filename: file.originalname,
      content: file.buffer
    }));

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: correo,
      subject: `Archivos para ${nombre}`,
      text: comentarios || "Se adjuntan los archivos solicitados",
      attachments
    });

    return res.status(200).json({
      mensaje: "✅ Correo enviado exitosamente"
    });

  } catch (error) {
    return res.status(500).json({
      mensaje: "❌ Error al enviar el correo",
      error: error.message
    });
  }
};

module.exports = { Enviarcorreo };
