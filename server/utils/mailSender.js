const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email, subject, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            secure: false, 
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
          });

          transporter.sendMail({
            from: "Automation App",
            to: email,
            subject: subject,
            html:body
          });
    } catch (err) {
        res.status(500).json({ 
            success: false,
             message: "error occurred while sending otp via email",
             })
    }
}


module.exports = mailSender;