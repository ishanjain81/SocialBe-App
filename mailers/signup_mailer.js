const nodeMailer = require('../config/nodemailer');

// this is another way of exporting
exports.newSignUp = (email,name) => {
    // console.log('Inside new Comment Mailer');
    let htmlString = nodeMailer.renderTemplate({email: email,name: name},'/SignUp/newsignup.ejs');

    nodeMailer.transporter.sendMail({
        from: 'webcodedev2021@gmail.com',
        to: email,
        subject: "Welocme To SocialBe",
        // html: '<h1> Yup, your comment is now published  </h1>'
        html: htmlString
    },(err,info) => {
        if(err){console.log('Error in Sending Mail',err); return}

        console.log('Mail Sent', info);
        return;
    });
}