var later = require('later');
var https = require('https');
var fs = require('fs');

var appID = require('./lib/config').appID;
var appSecret = require('./lib/config').appSecret;
var access_token;

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

//Ur5-Jd4pTywobMFIKeD5gboDhPVIp97P8ADZhr3HmT1eu0NdwYf7XRueVU4AOm6b_8PcsAOI1cjp9C9dTU-2UZVcEXTMt3MC12xbvsP5XsEn6MGgs0WyAuQDs97uNSBsSBQdACACLA