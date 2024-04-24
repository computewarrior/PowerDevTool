// ==UserScript==
// @name         M5开发助手
// @namespace    https://github.com/computewarrior/jablejs
// @version      1.1
// @description  获取开发平台关键信息
// @author       程序员战士
// @include http://192.168.0.50:5049/Form/*
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==
function doCopy(e) {
    e.clipboardData.setData('text/plain', retText);
    e.clipboardData.setData('text/html', retHtml);
    e.preventDefault();
}
var clipboardText = ""
function CopyText(e) {
    e.clipboardData.setData('text/plain', clipboardText);
    e.preventDefault();
}

function CopyToClipboard(text) {
    clipboardText = text;
    document.addEventListener('copy', CopyText);
    document.execCommand('copy');
    document.removeEventListener('copy', CopyText);
    clipboardText = "";
    text = "";
    // Power.ui.success("复制到剪贴板成功");
}
function getDateString() {
    var dt = new Date();
    var month = (dt.getMonth() + 1).toString().padStart(2,"0");
    var date = dt.getDate().toString().padStart(2, "0");
    return dt.getFullYear() + month + date;
}
(function () {
    var btns = document.getElementsByClassName("captiontools");
    if(btns&&btns.length>0){
        const supportBtn = document.createElement("ul");
        supportBtn.setAttribute("class","mini-menubar");
        supportBtn.setAttribute("style","float:right;margin-left:10px;");
        //supportBtn.setAttribute("onclick","supportBtnClick");
        //supportBtn.appendChild(icon);
        supportBtn.innerHTML="<li><span>dev助手</span>"+
		"<ul>"+        
        "<li class=\"separator\"></li>"+
        "<li iconCls=\"icon-cut\" onclick=\"onItemClick\">新标签页打开</li>"+
        "<li iconCls=\"icon-add\" onclick=\"onItemClick\">复制信息</li>"+
        "<li iconCls=\"icon-remove\" onclick=\"onItemClick\">打开源页面</li>"+
		"</ul></li>";
        btns[0].appendChild(supportBtn);
        mini.parse();
    }
    
})();
