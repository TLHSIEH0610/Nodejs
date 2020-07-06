var express = require('express');
var app = express();
var engine = require('ejs-locals');
var bodyParser = require('body-parser');

var admin = require("firebase-admin");

var serviceAccount = require("./project-36a6a-firebase-adminsdk-8zbmw-bb68209969.json");

app.engine('ejs',engine);
app.set('views','./views');
app.set('view engine','ejs');
//增加靜態檔案的路徑
app.use(express.static('public'))

//路由
app.get('/',function(req,res){
   res.render('index');
})

// 監聽 port
var port = process.env.PORT || 3000;
app.listen(port);

// 增加 body 解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://project-36a6a.firebaseio.com"
});

let fireData = admin.database();
// fireData.ref('todos').once('value',function(snapshot){
//    console.log(snapshot.val());
// })

// fireData.ref('todos').set({'say':'hellow'}).then(fireData.ref('todos').once('value',function(snapshot){
//    console.log(snapshot.val());
// }))

app.get('/',function(req,res){
   fireData.ref('todos').once('value',function(snapshot){
      let todos = snapshot.val();
      let how = todos.say;
      res.render('index',{how});
   })
})

app.post('/addtodo',function(req,res){
   let cont = req.body;
   console.log(cont);
   fireData.ref('todos').push({"content": cont}).then(
      function(){
         fireData.ref('todos').once('value',function(snapshot){
            console.log(snapshot.val())
            res.send({
               'success':'true',
               'data': snapshot.val(),
               'result': 'readable'
            });
         })
      })
})

// app.post('/addtodo',function(req,res){
//    let content = res.body.content;
//    let contentRef = fireData.ref('todos').push();
//    contentRef.set({"content": content}).then(
//       function(){
//          fireData.ref('todos').once('value',function(snapshot){
//             console.log(snapshot.val())
//             res.send({
//                'success':true,
//                'data': snapshot.val(),
//                'result': 'readable'
//             })
//          })
//       }
//    )
// })

