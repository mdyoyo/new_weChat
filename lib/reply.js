
//回复用户的文本消息
function replyText(msg,replyText){
    if(msg.xml.MsgType[0] === "text"){
        replyText = "收到你的消息了哦~";
    }
    if(msg.xml.MsgType[0] === "image"){
        replyText = "收到你的图片了哦~";
    }
    console.log("reply.js____replyText_____");

    var tmpl = require("tmpl");
    var replyTmpl = "<xml>" +
        "<ToUserName><![CDATA[{toUser}]]></ToUserName> " +
        "<FromUserName><![CDATA[{fromUser}]]></FromUserName> " +
        "<CreateTime><![CDATA[{time}]]></CreateTime> " +
        "<MsgType><![CDATA[{type}]]></MsgType> " +
        "<Content><![CDATA[{content}]]></Content> " +
        "</xml>";
    console.log(Date.now());
    return tmpl(replyTmpl,{
        toUser : msg.xml.FromUserName[0],
        fromUser : msg.xml.ToUserName[0],
        type : "text",
        time : Date.now(),
        content : replyText
    });
}

module.exports = {
    replyText: replyText
};