var request = require('request');
var fs = require('fs');

function getToken(appId, appSecret){
    var token;
    //先看是否有token缓存
    if(fs.existsSync('token.dat')){
        token = JSON.parse(fs.readFileSync('token.dat'));
    }
    //如果没有缓存或者过期
    if(!token || token.timeout < Date.now()){
        request('https://api.weixin.qq.com/cgi-bin/token?' +
        'grant_type=client_credential&' +
        'appid='+appId+'&' +
        'secret=' + appSecret,function(error,response,data){
            var result = JSON.parse(data);
//            result.timeout = Date.now() + 7000000;
            console.log("token result = ______");
            console.log(result.access_token);
            //更新token并缓存
            fs.writeFileSync('token.dat',JSON.stringify(result.access_token));
            return result.access_token;
        });
    }else{
        return token;
    }
}

module.exports = {
    getToken : getToken
};