
var http = require('http').Server(app);
var io = require('socket.io')(http);



io.on('connection', function(socket){
    console.log('a user conected');
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

module.exports = {
    io: io
};