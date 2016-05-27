var http = require('http');
var qs = require('qs');//url参数字符串和参数对象的转换
var url = require('url');
var crypto = require('crypto');

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
                    //if(result.xml.MsgType[0] === 'text'){
                    //    var userInfo = getUserInfo(result.xml.FromUserName[0]);
                    //    console.log('index.js_____userInfo______'+userInfo);
                    //    result.user = userInfo;
                    //
                    //}
                    console.log("index.js______json result___"+result);
                    var res = replyText(result,"消息推送成功！");
                    response.end(res);
                }
            });

        });
    }

});
server.listen(9529);
console.log('server running at port 9529');