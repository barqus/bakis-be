var nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
       auth: {
            user: 'fillq.auto@gmail.com',
            pass: 'lxyuxcgtyltkmuye',
         },
    secure: true,
});
module.exports = {
    transporter
} 