

function replyText(msg,replyText){
    if(msg.xml.MsgType[0] !== "text"){
        return "not text";
    }
    console.log("reply.js____replyText_____");
    console.log(msg);

    var tmpl = require("tmpl");
    var replyTmpl = "<xml>" +
        "<ToUserName><![CDATA[{toUser}]]></ToUserName> " +
        "<FromUserName><![CDATA[{fromUser}]]></FromUserName> " +
        "<CreateTime><![CDATA[{time}]]></CreateTime> " +
        "<MsgType><![CDATA[{type}]]></MsgType> " +
        "<Content><![CDATA[{content}]]></Content> " +
        "</xml>";
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