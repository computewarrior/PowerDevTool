    // ==UserScript==
    // @name         获取开发平台框架地址
    // @namespace    http://dev.p3china.com:7608/Scripts/PowerDevTool.js
    // @version      21.6.12
    // @description  获取平台地址,使debug更方便
    // @author       程序员战士
    // @include http://*
    // @include https://*
    // @grant GM_setValue
    // @grant GM_getValue
    //@updateURL     http://dev.p3china.com:7608/Scripts/PowerDevTool.js
    // ==/UserScript==
    // @require      https://cdn.jsdelivr.net/npm/vue/dist/vue.js
    function OpenNew() {
        console.log(window.location.href);
        window.open(window.location.href);
    }
    var config = {
        path: {
            field: "path",
            displayHtml: "<b>页面地址 : </b>",
            displayText: "页面地址:",
            type: "string",
            value: ""
        },
        keyword: {
            field: "keyword",
            displayHtml: "<b>关键词 : </b>",
            displayText: "关键词:",
            type: "Array",
            value: ""
        },
        formid: {
            field: "formid",
            displayHtml: "<b>当前窗体Id : </b>",
            displayText: "当前窗体Id:",
            type: "Array",
            value: ""
        },
        openformid: {
            field: "openformid",
            displayHtml: "<b>弹出窗体Id : </b>",
            displayText: "弹出窗体Id:",
            type: "Array",
            value: ""
        },
        keyvalue: {
            field: "keyvalue",
            displayHtml: "<b>KeyValue : </b>",
            displayText: "KeyValue : ",
            type: "string",
            value: ""
        },
        userCode: {
            field: "userCode",
            displayHtml: "<b>用户帐号 : </b>",
            displayText: "用户帐号:",
            type: "string",
            value: ""
        },
        userName: {
            field: "userName",
            displayHtml: "<b>用户名称 : </b>",
            displayText: "用户名称:",
            type: "string",
            value: ""
        },
        epsprojectname: {
            field: "epsprojectname",
            displayHtml: "<b>所属层级 : </b>",
            displayText: "所属层级 : ",
            type: "string",
            value: ""
        },
        Form: {
            field: "Form",
            displayHtml: "<b>表单地址 : </b>",
            displayText: "当前地址 : ",
            type: "string",
            value: ""
        },
        Menu: {
            field: "Menu",
            displayHtml: "<b>菜单地址 : </b>",
            displayText: "菜单地址 : ",
            type: "string",
            value: ""
        },
        Widget: {
            field: "Widget",
            displayHtml: "<b>窗体地址 : </b>",
            displayText: "窗体地址 : ",
            type: "string",
            value: ""
        },
        WidgetType: {
            field: "WidgetType",
            displayHtml: "<b>页面类型: </b>",
            displayText: "页面类型 : ",
            type: "string",
            value: ""
        },
        Login: {
            field: "Login",
            displayHtml: "<b>单点登陆地址 : </b>",
            displayText: "单点登陆地址 : ",
            type: "string",
            value: ""
        },
        Description: {
            field: "Description",
            displayHtml: "<b>问题描述 : </b>",
            displayText: "问题描述 : ",
            type: "string",
            value: ""
        }
    }
    var ClickBtn = '<ul class="list">' +
        '<li><button id="assistantBtn" class="fixBtn" style=""><i class="icon fa fa-diamond "></i>助手</button></li>' +
        '<li><button id="addWhiteList" class="fixBtn answerBtn" style=""><i class="icon fa fa-check "></i>运行</button></li>' +
        '<li><button id="notRun" class="fixBtn answerBtn" style="" title="选择关闭后只能控制台调用ReStart按钮重新运行">关闭<i class="icon fa fa-question-circle"></i></button></li>' +
        '<li><button id="ReStart" style="display:none"><i class="icon fa fa-question-circle"></i>重选</button></li>' +
      //  '<li><button id="removeWhiteList" class="fixBtn" style=""><i class="icon fa fa-trash-o "></i>排除</button></li>' +
        '<li><button id="viewSourceBtn" class="fixBtn" style=""><i class="icon fa fa-code "></i>源码</button></li>' +
        '<li><button id="copylink" class="fixBtn" style=""><i class="icon fa fa-link "></i>复制</button></li>' +
        '<li><button id="hideTool" class="fixBtn" style=""><i class="icon fa fa-eye-slash "></i>隐藏</button></li></ul>' +
        '<div id="extPanel" style=""><div class="btnGroup">' +
        '<a target="_blank" id="clickBtn" class="extBtn" style=""><i class="icon fa fa-external-link-square"></i>获取开发信息</a>' +
        '<a target="_blank" id="clearBtn" class="extBtn" style=""><i class="icon fa fa-undo"></i>清除权限缓存</a>' +
        '<a target="_blank" id="tapdBtn" class="extBtn" style="" href="#"><i class="icon fa fa-th-list"></i>前往TAPD</a>' +
        '<a class="extBtn" id="openNewBtn" href="javascript:void(0);"><i class="icon fa fa-crosshairs"></i>新窗口打开</a>' +
        '<a class="extBtn" id="openRaw" href="javascript:void(0);"><i class="icon fa fa-terminal"></i>打开源窗口</a>' +
        '<a id="getField" class="extBtn" style=""><i class="icon fa fa-columns"></i>获取字段信息</a>'+
        '<a id="removeWhiteList" class="extBtn" style="" href="#"><i class="icon fa fa-window-close"></i>关闭助手</a>' +
        '<p style="text-align:center;font-size:12px">Power by 程序员战士</p><div></div>';
    var retText = "",
        retHtml = "";

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
        ExtShow("复制到剪贴板成功");
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
    (function () {
        //不是miniui就返回吧
        if (typeof (mini) == "undefined")
            return;
        'use strict';
        var whiteList = {};
        whiteList = GM_getValue("whiteList");
        console.log("whiteList", whiteList);
        //绘制按钮
        //https://www.tapd.cn/52973815/bugtrace/bugreports/my_view
        var panelWidth = 220;
        var showWidth = 30;
        var calcWidth = panelWidth - showWidth;
        showWidth = calcWidth + "px";
        var hideWidth = (0 - calcWidth) + "px";
        if ($(".row:first").length == 1)
            $(".row:first").after(ClickBtn);
        else if ($(".captiontools:first").length == 1)
            $(".container:first").after(ClickBtn);
        else if ($(".container:first").length == 1)
            $(".container:first").after(ClickBtn);
        else
            console.warn("程序员助手前端页面未能写入");

        $("#tapdBtn").attr("href", "https://www.tapd.cn/52973815/bugtrace/bugreports/my_view");
        $(".icon").css({
            "color": "#ffffff",
            "margin-right": "5px"
        })
        $(".fixBtn").css({
            "background-color": "#33BD69",
            //"position": "fixed",
            "padding": "4px 6px",
            "color": "#FFFFFF",
            "font-size": "12px",
            "bottom": "80px",
            "right": "10px",
            "border": "none",
            "border-radius": "3px",
            "box-shadow": "-2px 2px 5px #0D7337",
            "cursor": "pointer",
            "display": "none"
        })
        $(".list").css({
            "position": "fixed",
            "bottom": "80px",
            "z-index": "99",
            "right": "10px",
            "list-style": "none"
        })
        $(".list li").css({
            "margin-top": "10px"
        })
        $("#extPanel").css({
            "display": "none",
            "background-color": "#EEE",
            "position": "fixed",
            "right": "80px",
            "bottom": "80px",
            "border-radius": "8px",
            "border": "1px solid #E5E5E5",
            "z-index": "99",
            "box-shadow": "-3px 3px 5px #FCC954"
        })
        $(".extBtn").css({
            "margin": "10px",
            "width": "110px",
            "display": "block",
            "padding": "4px 7px",
            "border-radius": "6px",
            "color": "#FFFFFF",
            "background-color": "#27BE65",
            "font-size": "12px",
            "cursor": "pointer",
            "font-weight": "400"
            // "box-shadow": "-3px 3px 5px #FCC954"
        })
        $("#assistantBtn").click(function () {
            $("#extPanel").toggle();
        })
        $(".extBtn,.fixBtn").mouseover(function () {
            $(this).css({
                "color": "#E30A09",
                "font-weight": "bold",
                "box-shadow": "-2px 2px 5px #E30A09"
            })
            //#0D7337
        })
        $(".fixBtn").mouseleave(function () {
            // Power.ui.success("你到我头上了");
            $(this).css({
                "box-shadow": "-2px 2px 5px #0D7337",
                "font-weight": "400",
                "color": "#FFFFFF",
            })
        })
        $(".extBtn").mouseleave(function () {
            // Power.ui.success("你到我头上了");
            $(this).css({
                "box-shadow": "none",
                "font-weight": "400",
                "color": "#FFFFFF",
            })
        })
        if (whiteList) {
            if (whiteList[window.location.host] == "1") {
                $(".fixBtn").show();
                $(".answerBtn").hide();
            }
            else if (whiteList[window.location.host] == "2")
            {
                $(".fixBtn").hide();
                $(".answerBtn").hide();
            }
            else
            $(".answerBtn").show();
        } else
            $(".answerBtn").show();
        //在主页就获取所有iframe框架
        var iframes = document.getElementsByTagName("iframe");
        console.log("当前页面地址:" + window.location.href);
        //debugger;
        if (iframes) {
            if (iframes.length > 0)
                console.log("iframs");
            //$("#assistantBtn").hide();
        }
        config.path.value = window.location.href;
        if (typeof (formconfig) != "undefined") {
            config.formid.value = formconfig.FormId;
            config.openformid.value = formconfig.config.openformid;
            config.keyvalue.value = formconfig.KeyValue;
            config.keyword.value = formconfig.config.joindata;
        }
        var regFormId = /Form\/(\S{36})\//;
        var pathMatches = config.path.value.match(regFormId);
        if (pathMatches && pathMatches.length > 0)
            config.formid.value = pathMatches[1]
        else {
            // ExtShow("已经到达相对页面")
            $("#assistantBtn").hide();
        }
        if (typeof (sessiondata) != "undefined") {
            config.userCode.value = sessiondata.UserCode;
            config.userName.value = sessiondata.UserName;
            config.epsprojectname.value = sessiondata.EpsProjName;
            config.Login.value = window.location.host + "/RGYLogin.aspx?Opt=BackDoor&UserCode=" + sessiondata.UserCode;
        }

        $("#clearBtn").click(function () {
            $.ajax({
                url: "/Account/ClearCache",
                success: function (res) {
                    var ret = JSON.parse(res);
                    if (ret.success) {
                        ExtShow("清除权限缓存成功")
                        // Power.ui.success("清除权限缓存成功");
                    } else
                        console.log(res);
                }
            })
        });
        $("#hideTool").click(function () {
            $(".list").hide();
            $("#assistantBtn").hide();
            $("#extPanel").hide();
        });
        $("#addWhiteList").click(function () {
            if (!whiteList) {
                whiteList = {};
            }
            whiteList[window.location.host] = "1";
            GM_setValue("whiteList", whiteList);
            ExtShow("添加成功");
            $(".fixBtn").show();
            $(".answerBtn").hide();
        });
        $("#removeWhiteList").click(function () {
            if (!whiteList) {
                whiteList = {};
            }
            whiteList[window.location.host] = "0";
            GM_setValue("whiteList", whiteList);
            ExtShow("移出成功");
            $(".fixBtn").hide();
            $(".answerBtn").show();
            $("#extPanel").hide();
        });
        $("#notRun").click(function () {
            var result = confirm("确定不运行?");
            if (result) {
                whiteList[window.location.host] = "2";
                GM_setValue("whiteList", whiteList);
                ExtShow("操作成功");
                $(".fixBtn").hide();
                $(".answerBtn").hide();
                $("#extPanel").hide();
            }
        })
        $("#ReStart").click(function () {
                whiteList[window.location.host] = "0";
                GM_setValue("whiteList", whiteList);
            ExtShow("操作成功");
            window.location.reload();
        })
        $("#openNewBtn").click(function () {
            window.open(window.location.href);
        });
        $("#openRaw").click(function () {
            if (config.Form.value)
                window.open(config.Form.value);
            else if (config.Widget.value)
                window.open(config.Widget.value);
            else {
                var param = {
                    KeyWord: "Widget",
                    KeyWordType: "BO",
                    index: "0",
                    select: "",
                    size: "8",
                    sort: "",
                    swhere: "id='" + config.formid.value + "'"
                }
                $.ajax({
                    url: "/Form/GridPageLoad",
                    data: param,
                    type: 'post',
                    async: false,
                    success: function (text) {
                        var res = mini.decode(text);
                        if (res.success) {
                            var data = mini.decode(res.data.value);
                            console.log("MenuWidget", data);
                            if (data[0].HtmlPath) {
                                var reg = /(PowerPlat)[\\/](FormXml)/;
                                var preFix = "\\PowerPlat\\FormXml\\zh-CN\\";
                                if (reg.test(data[0].HtmlPath))
                                    preFix = "";
                                var path = preFix + data[0].HtmlPath;
                                if (data[0].WidgetType == "6") {
                                    config.WidgetType.value = "URL链接";
                                    path = data[0].HtmlPath;
                                } else
                                    config.WidgetType.value = "静态页面";
                                if (data[0].bWebForm == "1")
                                    config.Form.value = path;
                                else
                                    config.Widget.value = path;
                                window.open(path);
                                // config.Widget=data[0].HtmlPath;
                            }
                        }
                    }
                })
            }
        })
        $("#viewSourceBtn").click(function () {
            window.open(window.location.href);
        })
        $("#copylink").click(function () {
            clipboardText = window.location.href;
            CopyToClipboard(clipboardText);
        })
        $("#getField").click(function () {
            var fieldsInfo = "";
            if (formconfig && formconfig.config && formconfig.config.joindata && formconfig.config.joindata.currow) {
                console.log("currow",formconfig.config.joindata.currow);
                for (var i in formconfig.config.joindata.currow)
                    fieldsInfo += i + "\n";
                CopyToClipboard(fieldsInfo);
            } else {
                ExtShow("无窗体配置信息");
                return;
            }
        })

        //console.log("助手的输出", retText);
        $("#clickBtn").click(function () {
            if (config.formid.value) {
                var param = {
                    KeyWord: "Widget",
                    KeyWordType: "BO",
                    index: "0",
                    select: "",
                    size: "8",
                    sort: "",
                    swhere: "id='" + config.formid.value + "'"
                }
                $.ajax({
                    url: "/Form/GridPageLoad",
                    data: param,
                    type: 'post',
                    async: false,
                    success: function (text) {
                        var res = mini.decode(text);
                        if (res.success) {
                            var data = mini.decode(res.data.value);
                            console.log("MenuWidget", data);
                            if (data[0].HtmlPath) {
                                var reg = /(PowerPlat)[\\/](FormXml)/;
                                var preFix = "\\PowerPlat\\FormXml\\zh-CN\\";
                                if (reg.test(data[0].HtmlPath))
                                    preFix = "";
                                var path = preFix + data[0].HtmlPath;
                                if (data[0].WidgetType == "6") {
                                    config.WidgetType.value = "URL链接";
                                    path = data[0].HtmlPath;
                                } else
                                    config.WidgetType.value = "静态页面";
                                if (data[0].bWebForm == "1")
                                    config.Form.value = path;
                                else
                                    config.Widget.value = path;
                                // config.Widget=data[0].HtmlPath;
                            }
                        }
                    }
                })
            } else
                alert("窗体Id不存在");
            if (!retText && !retHtml) {
                for (var i in config) {
                    if (config[i].value) {
                        if (i == "path") {

                            retText += "链接地址 : " + config[i].value + "\n";
                            retHtml += "<b>链接地址 : </b>" + " <a target='_blank' href='" + config[i].value + "'>" + config[i].value + "</a><br>";
                            continue;
                        }
                        if (i == "keyword") {
                            // displayHtml: "<b>关键词:</b>",
                            // displayText: "关键词:",
                            if (config[i].value.children.length > 0) {
                                retText += config[i].displayText + config[i].value.KeyWord + "\n";
                                retHtml += config[i].displayHtml + config[i].value.KeyWord + "<br>";
                                for (var j = 0; j < config[i].value.children.length; j++) {
                                    retText += "子表关键词" + j + ":" + config[i].value.children[j].KeyWord + "\n";
                                    retHtml += "<b>关键词" + j + ":</b>" + config[i].value.children[j].KeyWord + "<br>";
                                }
                                continue;
                            } else
                                config[i].value = config[i].value.KeyWord
                        }
                        retText += config[i].displayText + config[i].value + "\n";
                        retHtml += config[i].displayHtml + config[i].value + "<br>";
                    }
                    if (i == "Description") {
                        retText += config[i].displayText + "\n";
                        retHtml += config[i].displayHtml + "<br>";
                    }
                }
            }
            document.addEventListener('copy', doCopy);
            document.execCommand('copy');
            document.removeEventListener('copy', doCopy);
            // Power.ui.success("复制到剪贴板成功");
            ExtShow("复制到剪贴板成功");
        })


        //获取框架地址。
        //console.log("good");
    })();

    function BreakDowmUrl(url) {
        var windowReg = /\/Form\/EditForm\//; //窗体页面
        var wizardReg = /\/Form\/Wizard/; //向导窗体
        var formReg = /\/Form\/ValidForm\//;
        if (windowReg.test(url)) {
            return "窗体";
        } else if (wizardReg.test(url)) {
            return "向导";
        } else if (formReg.test(url)) {
            return "表单";
        }
}
function ReStart() {
    console.log("触发了重新开始方法");
}