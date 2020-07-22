var express = require('express');
var app = express();
var engine = require('ejs-locals');
var bodyParser = require('body-parser');

var admin = require("firebase-admin");

var serviceAccount = require("./project-36a6a-firebase-adminsdk-8zbmw-bb68209969.json");
var cors = require('cors');
const corsOptions = {
    origin: 'https://tlhsieh0610.github.io/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.engine('ejs',engine);
app.set('views','./views');
app.set('view engine','ejs');
//增加靜態檔案的路徑
app.use(express.static('public'))

// 監聽 port
var port = process.env.PORT || 3000;
app.listen(port);

// 增加 body 解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://project-36a6a.firebaseio.com"
});

let fireData = admin.database();

//路由 routes
// var airRouter = require('./routers/air');
// app.use('/air', airRouter);

// let allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:8080/');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     next();
//   }
//   app.use(allowCrossDomain)



var contact = require('./routers/contact');
app.use('/contact', contact);




app.get('/',function(req,res){
   fireData.ref('todos').once('value',function(snapshot){
       var data = snapshot.val();
       res.render('index',{"todolist":data})
   })
})


app.post('/addTodo',function(req,res){
   var content = req.body.content;
   var contentRef = fireData.ref('todos').push();
   contentRef.set({"content":content})
   .then(function(){
       fireData.ref('todos').once('value',function(snapshot){
           res.send(
               {
                   "success": true,
                   "result": snapshot.val(),
                   "message": "資料讀取成功"
               }
           );
       })
   })
})

app.post('/removeTodo',function(req,res){
    let id = req.body.id;
    fireData.ref('todos').child(id).remove()
    .then(function(){
        fireData.ref('todos').once('value',function(snapshot){
            res.send({
                "success": true,
                "result": snapshot.val(),
                "message": "資料刪除成功"
            })
        })
    })
})