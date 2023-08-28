const nodemailer = require("nodemailer");


let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'divyush@f22labs.com',
        pass: 'Divyushpoonia1*'
    }
});

function sendEmail(to, subject, text, from = 'divyush@f22labs.com') {

    let mailDetails = {
        from,
        to,
        subject,
        text
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}

module.exports = sendEmail;