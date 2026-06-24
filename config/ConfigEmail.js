const nodemailer = require("nodemailer");

async function CrateTranporte() {


    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        // 🚀 Fase test: generar cuenta temporal de Ethereal
        const testAccount = await nodemailer.createTestAccount();
        console.log("Cuenta de prueba Ethereal:", testAccount);

        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            },
            tls: { rejectUnauthorized: false }
        });
    } else {
        // 🚀 Producción: usar credenciales del .env
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,   // smtp.sendgrid.net
            port: process.env.SMTP_PORT,   // 587
            secure: false,                 // true si usas 465
            auth: {
                user: process.env.SMTP_USER, // debe ser "apikey"
                pass: process.env.SMTP_PASS, // tu API Key
            },
            tls: { rejectUnauthorized: false },
        });
    }



}

module.exports = CrateTranporte;