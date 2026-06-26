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
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: { rejectUnauthorized: false }
        });
    }

    
    
}

module.exports = CrateTranporte;