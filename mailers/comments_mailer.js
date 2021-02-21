const nodeMailer = require('../config/nodemailer');

// this is another way of exporting
exports.newComment = (comment) => {
    // console.log('Inside new Comment Mailer');
    let htmlString = nodeMailer.renderTemplate({comment: comment},'/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'webcodedev2021@gmail.com',
        to: comment.user.email,
        subject: "New Comment Published",
        // html: '<h1> Yup, your comment is now published  </h1>'
        html: htmlString
    },(err,info) => {
        if(err){console.log('Error in Sending Mail',err); return}

        console.log('Mail Sent', info);
        return;
    });
}