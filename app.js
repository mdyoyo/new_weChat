var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendfile('index2.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    //io.sockets.server.eio.clientsCount
//    console.log(io.engine.clients);//io.sockets.connected
    console.log(io.sockets.server.eio.clientsCount);//客户端数量

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

});

io.broadcast = function broadcast(data) {
    console.log("io.broadcast向所有广播");
    io.sockets.emit('chat message', JSON.stringify(data));//向所有客户端发送
};

app.set('port', process.env.PORT || 3000);

var server = http.listen(app.get('port'), function() {
    console.log('start at port:' + server.address().port);
});
//io.on('connection',function(socket){
//    console.log('a user connected');
//    var clients = io.sockets.client();
//    console.log(clients);
//    console.log(io.sockets.connected);
//    socket.on('chat message',function(msg){
//        console.log('message: '+msg);
//        io.emit('chat message',msg);
//    });
//});

;