var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var router = express.Router();
var Client = require('node-rest-client').Client;
var client = new Client();



require('dotenv').config();




router.get('/', function(req, res) {
    res.render('contact');
});


router.post('/post', function(req, res) {
    // res.header("Access-Control-Allow-Origin","http://localhost:8080");
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
module.exports = router;
