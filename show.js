var express = require('express');
var path = require('path');
var app = express();
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.get('/',function(req,res){
    res.render('index.ejs');//页面
});
app.listen(3000,function(req,res){
    console.log('app is running at port 3000.');
});
