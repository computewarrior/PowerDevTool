// ==UserScript==
// @name         M5开发助手
// @namespace    https://github.com/computewarrior/jablejs
// @version      1.1
// @description  获取开发平台关键信息
// @author       程序员战士
// @include http://192.168.0.50:5049/Form/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_cookie
// ==/UserScript==

var userCode;
var userName;
var epsProjName;
var formId;
var htmlPath;
var token;
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
function ExtShow(text) {
    if (mini != undefined) {
        mini.showTips({
            content: text,
            state: "info"
        })
    } else if (Power != undefined) {
        Power.ui.info(text)
    } else
        alert(text)
}
function getHtmlPath(widgetId, callback){
    if(htmlPath)
    {
        callback(htmlPath);
        return;
    }
    var param = {
        KeyWord: "Widget",
        KeyWordType: "BO",
        index: "0",
        select: "",
        size: "8",
        sort: "",
        swhere: "id='" + widgetId + "'"
    }
    FormFuns.EncodeGridPageLoadswhere(param);
    $.ajax({
        url: "/Form/GridPageLoad", //此接口地址可以改为自定义控制器接口地址返回更多信息,然后赋值给模板对象
        data: param,
        type: 'post',
        //async: false,
        success: function (text) {
            var res = mini.decode(text);
            if (res.success) {
                var data = mini.decode(res.data.value);
                if (data.length>0&&data[0].HtmlPath) {
                    htmlPath = data[0].HtmlPath;
                    // config.Widget=data[0].HtmlPath;
                }
                callback(htmlPath);
            }
        }
    })
}
function getDateString() {
    var dt = new Date();
    var month = (dt.getMonth() + 1).toString().padStart(2,"0");
    var date = dt.getDate().toString().padStart(2, "0");
    return dt.getFullYear() + month + date;
}

function openRawHtml(){
    if(!formId)
    {
        ExtShow("FormId获取失败");
        return;
    }
    getHtmlPath(formId, function(path){
        if(path)
        {
        console.log("html", path)
        ExtShow("获取成功");
        window.location.href=path;
        }
        else
        ExtShow("获取失败!");
    })
}
function openNewWindow(){
    console.log("click", window.location.href)
    window.open(window.location.href);
}
function menuClick(e){
    console.log("click openNewWindow")
}
function getDevInfo(){
    console.log("getDevInfo Inner")
}
(function () {
    function menuClick(e){
        console.log("click openNewWindow")
    }
    'use strict';
    var btns = document.getElementsByClassName("captiontools");
    if(btns&&btns.length>0){
        const supportBtn = document.createElement("ul");
        supportBtn.setAttribute("class","mini-menubar");
        //supportBtn.setAttribute("onitemclick","menuClick")
        supportBtn.setAttribute("style","float:right;margin-left:10px;");
        //supportBtn.appendChild(icon);
        supportBtn.innerHTML="<li><span>dev tool</span>"+
		"<ul>"+
        "<li id=\"getDevInfo\"><i class=\"icon fa fa-external-link-square\"></i>获取开发信息</li>"+        
        "<li class=\"separator\"></li>"+
        "<li id=\"openNewWindow\"><i class=\"fa fa-code\"></i>新窗口打开</li>"+
        "<li id=\"openRawHtml\"><i class=\"icon fa fa-terminal\"></i>打开源窗口</li>"+
        "<li id=\"getformdata\"><i class=\"icon fa fa-columns\"></i>获取字段信息</li>"+
        "<li id=\"gettoken\"><i class=\"icon fa fa-columns\"></i>获取token</li>"+
		"</ul></li>";
        btns[0].appendChild(supportBtn);
        mini.parse();
    }
    if(sessiondata){
        userCode = sessiondata.UserCode;
        userName = sessiondata.UserName;
        epsProjName = sessiondata.EpsProjName
    }
    if(typeof(FormId)!='undefined')
    {
        formId = FormId||getParameter("FormId");
    }
    $("#openNewWindow").click(function () {
        console.log("click openNewWindow")
        openNewWindow();
    })
    $("#openRawHtml").click(function () {
        console.log("click openRawHtml")
        openRawHtml();
    })
    $("#getDevInfo").click(function () {
        console.log("#getDevInfo click")
        getDevInfo();
    })
    $("#gettoken").click(function(){
        var reg=/_TOKEN=(\S+);/
        var matches=document.cookie.match(reg);
        if(matches.length==2)
        token=matches[1];
        else
        ExtShow("获取失败!");
        console.log("token", token);
        CopyToClipboard(token);
        ExtShow("复制成功");
    })
})();
