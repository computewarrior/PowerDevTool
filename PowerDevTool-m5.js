// ==UserScript==
// @name         M5开发助手
// @namespace    https://github.com/computewarrior/powertooljs
// @version      1.1
// @description  获取开发平台关键信息
// @author       程序员战士
// @include http://*/Form/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_cookie
// ==/UserScript==

var userCode;
var userName;
var epsProjName;
var formId;
var htmlPath;
var url;
var keyword;
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
function getHtmlPath(widgetId, callback) {
    if (htmlPath) {
        callback(htmlPath);
        return htmlPath;
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
        async: false,
        success: function (text) {
            var res = mini.decode(text);
            if (res.success) {
                var data = mini.decode(res.data.value);
                if (data.length > 0 && data[0].HtmlPath) {
                    htmlPath = data[0].HtmlPath;
                    // config.Widget=data[0].HtmlPath;
                }
                if (callback)
                    callback(htmlPath);
            }
        }
    })
    return htmlPath;
}
function getDateString() {
    var dt = new Date();
    var month = (dt.getMonth() + 1).toString().padStart(2, "0");
    var date = dt.getDate().toString().padStart(2, "0");
    return dt.getFullYear() + month + date;
}

function openRawHtml() {
    if (!formId) {
        ExtShow("FormId获取失败");
        return;
    }
    getHtmlPath(formId, function (path) {
        if (path) {
            console.log("html", path)
            ExtShow("获取成功");
            window.open(path);
        }
        else
            ExtShow("获取失败!");
    })
}
function openNewWindow() {
    console.log("click", window.location.href)
    window.open(window.location.href);
}
function menuClick(e) {
    console.log("click openNewWindow")
}
function getDevInfo() {
    console.log("getDevInfo Inner")
    var cvInfo = "";
    if (userCode) {
        cvInfo += "用户名:" + userName + "(" + userCode + ")\n"
    }
    if (epsProjName)
        cvInfo += "所在层级:" + epsProjName + "\n";
    if (keyword)
        cvInfo += "关键词:" + keyword + "\n";
    cvInfo += "页面地址:" + url + "\n";
    if (formId) {
        cvInfo += "页面Id:" + formId + "\n";
        let localPath = getHtmlPath(formId, null);
        cvInfo += "页面路径:" + localPath + "\n";
    }
    CopyToClipboard(cvInfo);
    ExtShow("复制成功");
}

(function () {
    function menuClick(e) {
        console.log("click openNewWindow")
    }
    'use strict';
    url = window.location.href;
    var formType = "Default";

    if (url.indexOf("/Form/ValidForm/") > 0)
        formType = "Form";
    else if (url.indexOf("/Form/EditForm/") > 0)
        formType = "Widget";
    else if (url.indexOf("/Form/AddForm/") > 0)
        formType = "Form";

    if (sessiondata) {
        userCode = sessiondata.UserCode;
        userName = sessiondata.UserName;
        epsProjName = sessiondata.EpsProjName
    }
    if (typeof (FormId) != 'undefined') {
        formId = FormId || getParameter("FormId");
    }
    if (typeof (KeyWord) != 'undefined') {
        keyword = KeyWord;
    }
    else if (formconfig && formconfig.config && formconfig.config.joindata && formconfig.config.joindata.KeyWord) {
        keyword = formconfig.config.joindata.KeyWord;
    }

    var btns = document.getElementsByClassName("captiontools");
    if (btns.length == 0) {
        btns = document.getElementsByClassName("caption");
    }
    if (btns.length > 0) {
        const supportBtn = document.createElement("ul");
        supportBtn.setAttribute("class", "mini-menubar");
        supportBtn.setAttribute("id", "devtool");
        //supportBtn.setAttribute("onitemclick","menuClick")
        supportBtn.setAttribute("style", "float:right;margin-left:10px;");
        //supportBtn.appendChild(icon);
        var html = "<li><span><i class=\"fa fa-diamond\"></i>dev tool</span>";
        html += "<ul>";
        html += "<li id=\"getDevInfo\"><i class=\"icon fa fa-external-link-square\"></i>获取开发信息</li>";
        html += "<li class=\"separator\"></li>";
        html += "<li id=\"openNewWindow\"><i class=\"fa fa-code\"></i>新窗口打开</li>";
        html += "<li id=\"openRawHtml\"><i class=\"icon fa fa-terminal\"></i>打开源窗口</li>";
        if (formType == "Form") {
            html += "<li id=\"getformdata\"><i class=\"icon fa fa-columns\"></i>获取字段信息</li>";
        }
        html += "<li id=\"gettoken\"><i class=\"icon fa fa-columns\"></i>获取token</li>";
        html += "<li id=\"searchData\"><i class=\"icon fa fa-search\"></i>查询数据</li>";
        if (formType == "Widget" && keyword)
            html += "<li id=\"ignoreRight\"'><i class=\"icon fa fa-unlock\"></i>忽略权限</li>";
        html += "<li id=\"hideTool\"><i class=\"icon fa fa-window-close\"></i>隐藏工具</li>";
        html += "</ul></li>";
        supportBtn.innerHTML = html;
        btns[0].appendChild(supportBtn);
        console.log("工具注入成功");
        mini.parse();
    }
    else {
        console.warn("开发助手找不到锚点")
        return;
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
    $("#hideTool").click(function () {
        $("#devtool").hide();
    });
    $("#ignoreRight").click(async () => {
        var grid = mini.get(keyword);
        grid.setUrl('/Form/GridPageLoadEx');
        Power.ui.success("忽略权限成功!");
        grid.reload();
    })
    $("#searchData").click(function () {
        Power.ui.prompt("请输入关键词", function (keyword) {
            console.log("input keyword", keyword);
            if (!keyword) {
                ExtShow("请输入关键词");
                return;
            }
            Power.ui.prompt("请输入查询条件", function (swhere) {
                if (swhere) {
                    swhere = FormFuns.ReplaceCondition(swhere, swherereplace);
                    swhere = base64encode(swhere);
                }
                else
                    swhere = "";
                var path = "/Form/GridPageLoadEx?pageIndex=0&pageSize=1&sortField=&sortOrder=&KeyWord=" + keyword + "&KeyWordType=BO&select=&swhere=" + swhere + "&sort=Sequ+desc&index=0&size=20&extparams=eyJlbmNvZGVzd2hlcmUiOiJ0cnVlIn0=";
                $.get(path, function (text) {
                    var res = mini.decode(text);
                    if (res.success) {
                        ExtShow("查询成功");
                        console.log("totalCount", res.data.totalcount)
                        const dataList = mini.decode(res.data.value);
                        console.log("dataList", dataList);
                    }
                    else
                        ExtShow(res.message);
                });
                //window.open(path);
                this.close();
            })
            this.close();
        })
    });
    $("#gettoken").click(function () {
        if (typeof (sessiondata) != "undefined") {
            console.log("token", sessiondata.SessionId);
            CopyToClipboard(sessiondata.SessionId);
            ExtShow("复制成功");
        }
        else
            ExtShow("获取失败!");
    })
})();
