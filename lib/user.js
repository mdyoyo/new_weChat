var request = require('request');
var getToken = require('./token').getToken;
var appID = require('./config').appID;
var appSecret = require('./config').appSecret;

function getUserInfo(openId){
    var token = getToken(appID, appSecret);
    console.log("token is _____"+token);
    request('https://api.weixin.qq.com/cgi-bin/user/info?' +
        'access_token=' + token +
        '&openid=' + openId +
        '&lang=zh_CN',function(error,response,data){
            if(error){
                console.log('getUserInfo______'+error);
            }else{
                console.log('getUserInfo______data');
                console.log(data);
                return JSON.parse(data);
            }
        }
    );
}

module.exports = {
    getUserInfo : getUserInfo
};