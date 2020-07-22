var express = require('express');
var app = express();
var engine = require('ejs-locals');
var bodyParser = require('body-parser');
require('dotenv').config();
var admin = require("firebase-admin");
var nodemailer = require('nodemailer');


var cors = require('cors');
const corsOptions = {
    //http://localhost:8081/ https://tlhsieh0610.github.io
    origin: 'https://tlhsieh0610.github.io',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

//增加靜態檔案的路徑
app.use(express.static('public'))

// 監聽 port
var port = process.env.PORT || 3000;
app.listen(port);

// 增加 body 解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

//路由 routes
app.post('/post', function(req, res) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
          type: "OAuth2",
          user: process.env.ACCOUNT,
          clientId: process.env.CLINENTID,
          clientSecret: process.env.CLINENTSECRET,
          refreshToken: process.env.REFRESHTOKEN,
        }
      });

    console.log( req.body);
    let mailOption = {
        from: `"使用者留言"<${req.body.email}>`,  
        to : 'tlhsieh0610@gmail.com',
        subject:req.body.username +'寄了一封信',
        text: req.body.description
    }
    transporter.sendMail(mailOption,function(error,info){
        console.log(req);
        if(error){
            return console.log(error);
        }
        res.send('送出成功');
    })
 
});