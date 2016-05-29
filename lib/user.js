var request = require('request');
var getToken = require('./token').getToken;
var appID = require('./config').appID;
var appSecret = require('./config').appSecret;
var https = require('https');

function getUserInfo2(openId){
    var token = getToken(appID, appSecret);
    console.log("token is _____"+token);
    request('https://api.weixin.qq.com/cgi-bin/user/info?' +
        'access_token=' + token +
        '&openid=' + openId +
        '&lang=zh_CN',function(error,response,data){
            if(error){
                console.log('getUserInfo______'+error);
            }else{
                console.log('0getUserInfo______data');
                console.log(data);
                return JSON.parse(data);
            }
        }
    );
}
function getUserInfo(openId){
    var token = getToken(appID, appSecret);
    console.log("token is _____"+token);
    var options = {
        hostname: 'api.weixin.qq.com',
        path: '/cgi-bin/user/info?' +
        'access_token=' + token +
        '&openid=' + openId +
        '&lang=zh_CN'
    };
    var req = https.get(options,function(res){
        var bodyChunks = '';
        res.on('data',function(chunk){
            bodyChunks += chunk;
        });
        res.on('end',function(){
            var body = JSON.parse(bodyChunks);
            console.log('0getUserInfo______data');
            console.log(body);
            return body;
        })
    });
    req.on('error', function (e) {
        console.log('ERROR: ' + e.message);
    });
}
module.exports = {
    getUserInfo : getUserInfo
};