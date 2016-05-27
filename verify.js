var http = require('http');
var qs = require('qs');//url参数字符串和参数对象的转换
var url = require('url');
var crypto = require('crypto');

var TOKEN = "sspku";

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
//    console.log("request.url:  "+request.url);
    var query = url.parse(request.url).query;//?后面的内容
//    console.log("query: "+query);
    var params = qs.parse(query);
//    console.log("params: "+params);

    if(checkSignature(params,TOKEN)){
        response.end(params.echostr);////若确认此次GET请求来自微信服务器，请原样返回echostr参数内容，则接入生效，成为开发者成功
    }else{
        response.end('校验失败');
    }
});
server.listen(9529);
console.log('server running at port 9529');