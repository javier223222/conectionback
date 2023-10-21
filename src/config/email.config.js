const nodemailer = require('nodemailer');

const mail={
    user:process.env.USEREMAIL,
    pass:process.env.PASS
}




let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    tls: {
        rejectUnauthorized: false
    },
    secure: true, // true for 465, false for other ports
    auth: {
      user: mail.user, // generated ethereal user
      pass: mail.pass, // generated ethereal password
    },
  });

  const sendEmail = async (email, subject, html) => {
    try {
        
        await transporter.sendMail({
            from: `UpConection <${ mail.user }>`, // sender address
            to: email, // list of receivers
            subject, // Subject line
            text: "Confirmacion de registro", // plain text body
            html, // html body
        });

    } catch (error) {
        console.log('Algo no va bien con el email', error);
    }
  }

  const getTemplate = (name, token) => {
      return `
        <head>
            <link rel="stylesheet" href="./style.css">
        </head>
        
        <div id="email___content">
            <img src="https://res.cloudinary.com/drquhxacx/image/upload/v1696872183/avatar/easynotes-removebg-preview_rpiw2v.png" alt="">
            <h2 >Hola ${ name }</h2>
            <p >Para confirmar  su cuenta de easy notes  ingrese al siguiente link</p>
            <a
            style="color:#FFCDCD"
                href="http://localhost:80/api/v1/user/${token}"
                target="_blank"
            >Confirmar Cuenta</a>
        </div>
      `;
  }

  module.exports = {
    sendEmail,
    getTemplate
  }