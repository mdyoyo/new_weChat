var http = require('http');
var qs = require('qs');//url参数字符串和参数对象的转换
var url = require('url');
var crypto = require('crypto');

var later = require('later');
var https = require('https');
var fs = require('fs');

var app = require('express')();
var http2 = require('http').Server(app);
var io = require('socket.io')(http2);

var appID = require('./lib/config').appID;
var appSecret = require('./lib/config').appSecret;
var getToken = require('./lib/token').getToken;
var access_token;

var TOKEN = "sspku";
var getUserInfo = require('./lib/user').getUserInfo;
var replyText = require('./lib/reply').replyText;

function checkSignature(params,token){
    //1.将token、timestamp、nonce三个参数进行字典序排序
    //2.将三个参数字符串拼接成一个字符串进行sha1加密
    //3.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信

    var key = [token,params.timestamp,params.nonce].sort().join('');
    var sha1 = crypto.createHash('sha1');
    sha1.update(key);

    return sha1.digest('hex') == params.signature;
}

var server = http.createServer(function(request,response){

    var query = url.parse(request.url).query;//?后面的内容
    var params = qs.parse(query);

    if(!checkSignature(params,TOKEN)){
        response.end('校验失败');
    }
    if(request.method == "GET"){
        //get请求，返回echostr用于通过服务器有效校验
        response.end(params.echostr);
    }
    else{//post请求，微信发给开发者服务器
        var postdata = "";
        request.addListener("data",function(postchunk){
            postdata += postchunk;
        });
        request.addListener("end",function(){
            var parseString = require('xml2js').parseString;
            parseString(postdata,function(err,result){
                if(!err){
                    if(result.xml.MsgType[0] === 'text'){
                        console.log(result.xml.CreateTime[0]);
                        var token = getToken(appID, appSecret);
                        console.log("token is _____"+token);
                        var options = {
                            hostname: 'api.weixin.qq.com',
                            path: '/cgi-bin/user/info?' +
                            'access_token=' + token +
                            '&openid=' + result.xml.FromUserName[0] +
                            '&lang=zh_CN'
                        };
                        var req = https.get(options,function(res){
                            var bodyChunks = '';
                            res.on('data',function(chunk){
                                bodyChunks += chunk;
                            });
                            res.on('end',function(){
                                var userInfo = JSON.parse(bodyChunks);
                                console.log('0getUserInfo______data');
                                console.log(userInfo);
//                                var userInfo = getUserInfo(result.xml.FromUserName[0]);
                                console.log('1index.js_____userInfo______');
                                //console.log(userInfo);
                                result.user = userInfo;
                                console.log("2index.js______json result___");
                                console.log(result);
                                io.broadcast(result);
                                var resp = replyText(result,"消息推送成功！");
                                response.end(resp);

                            })
                        });
                        req.on('error', function (e) {
                            console.log('ERROR: ' + e.message);
                        });

                    }

                }
            });

        });
    }

});
server.listen(9529);
console.log('server running at port 9529');

var path = require('path');
app.use(require('express').static(path.join(__dirname,'public')));

app.get('/', function(req, res){
    res.sendfile('index.html');
});
io.on('connection', function(socket){
    console.log('a user connected');
    //io.sockets.server.eio.clientsCount
//    console.log(io.engine.clients);//io.sockets.connected
//    console.log(io.sockets.server.eio.clientsCount);//客户端数量
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});
io.broadcast = function broadcast(data) {
    console.log("io.broadcast向所有广播");
    io.sockets.emit('chat message', JSON.stringify(data));//向所有客户端发送
};
app.set('port', process.env.PORT || 9902);
var server2 = http2.listen(app.get('port'), function() {
    console.log('start at port:' + server2.address().port);
});


/*定时器*/
later.date.localTime();
console.log("Now_____"+ new Date());

var sched =  later.parse.recur().every(2).hour();//每隔两小时
next = later.schedule(sched).next(10);
console.log("next______");
console.log(next);

var timer = later.setInterval(test,sched);
setTimeout(test,2000);

function test(){
    console.log("test()______" + new Date());
    var options = {
        hostname: 'api.weixin.qq.com',
        path: '/cgi-bin/token?' +
        'grant_type=client_credential' +
        '&appid=' + appID +
        '&secret=' + appSecret
    };
    var req = https.get(options,function(res){
        var bodyChunks = '';
        res.on('data',function(chunk){
            bodyChunks += chunk;
        });
        res.on('end', function () {
            var body = JSON.parse(bodyChunks);
            //console.dir(body);
            if (body.access_token) {
                access_token = body.access_token;

                console.log(access_token);
                //缓存token
                fs.writeFileSync('token.dat',JSON.stringify(access_token));
            } else {
                console.dir(body);
            }
        });
    });
    req.on('error', function (e) {
        console.log('ERROR: ' + e.message);
    });
}

