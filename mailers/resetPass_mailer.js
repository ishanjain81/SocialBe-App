const nodeMailer = require('../config/nodemailer');

// this is another way of exporting
exports.ResetPass = (User_Pass,email) => {
    let htmlString = nodeMailer.renderTemplate({User_Pass: User_Pass},'/resetPass/reset_Pass.ejs');
    nodeMailer.transporter.sendMail({
        from: 'webcodedev2021@gmail.com',
        to: email,
        subject: "Reset Password",
        html: htmlString
    },(err,info) => {
        if(err){console.log('Error in Sending Mail',err); return}

        console.log('Mail Sent', info);
        return;
    });
}