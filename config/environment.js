const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial-users',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: '',//yout email id
            pass: ''//your mail password
        }
    },
    google_client_id: "",//your client id
    google_client_secret: "",//yout secret client id
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.WEB_ASSET_PATH,
    session_cookie_key: process.env.WEB_SESSION_COOKIE_KEY,
    db: process.env.WEB_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.WEB_GMAIL_USERNAME,
            pass: process.env.WEB_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.WEB_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.WEB_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.WEB_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.WEB_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

if(eval(process.env.NODE_ENV == undefined)){
    console.log('Running in Development Mode');
}
else{
    console.log('Running in Production Mode');
}

module.exports = eval(process.env.NODE_ENV) == undefined ? development: eval(process.env.NODE_ENV);