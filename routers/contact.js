var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

require('dotenv').config();

router.get('/', function(req, res) {
    res.render('contact');
});
router.get('/review', function(req, res) {
    res.render('contactReview');
});

router.post('/post', function(req, res) {
    res.header("Access-Control-Allow-Origin","*");
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

    let mailOption = {
        from: `"使用者留言"<${req.body.email}>`,  
        to : 'tlhsieh0610@gmail.com',
        subject:req.body.username +'寄了一封信',
        text: req.body.description
    }
    transporter.sendMail(mailOption,function(error,info){
        console.log(req.body.email);
        if(error){
            return console.log(error);
        }
        
        res.redirect('review');
    })
 
});
module.exports = router;
