const nodemailer= require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth : {
        type:"OAUTH2",
        user:process.env.GMAIL_ACC,
        password:process.env.GMAIL_PASSWORD
    }
})

module.exports={
    transporter
}