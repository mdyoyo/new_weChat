var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req,res){
    res.sendFile('index2.html');
});

io.on('connection',function(socket){
    console.log('a user connected');
    var clients = io.sockets.client();
    console.log(clients);
    console.log(io.sockets.connected);
    socket.on('chat message',function(msg){
        console.log('message: '+msg);
        io.emit('chat message',msg);
    });
});

app.set('port',process.env.PORT || 9902);

var server =  http.listen(app.get('port'),function(){
    console.log('start at port:' + server.address().port);
});