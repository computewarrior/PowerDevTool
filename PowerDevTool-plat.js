// ==UserScript==
// @name         普华开发平台助手
// @namespace    https://github.com/computewarrior/powertooljs
// @version      1.1
// @description  开发平台复制表
// @author       程序员战士
// @include http://*/PowerPlat/View/Entity/EntityManage.html?*
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
function openPropertyList(row, grid) {
    if (grid.isShowRowDetail(row) == false) return;  //如果已经展开了，则不再继续
    var td = grid.getRowDetailCellEl(row);
    if (td == undefined) {
        var EntityTableID = row.EntityTableID;
        var tableName = row.TableName;
        var tables = grid.getData();
        var flag = false;

        for (var iTmp = 0; iTmp < tables.length; iTmp++) {
            if (tables[iTmp].EntityTableID != EntityTableID) continue;
            flag = true;
        }
        if (flag == false) return;
        if (!top["sub" + EntityTableID]) return;
        top["sub" + EntityTableID].DataBaseCode = row.DataBaseCode;
        top["sub" + EntityTableID].init();
        return;
    }
    if (td.tag == "true") return;
    td.tag = "true";

    var o = new Object();
    var DataBaseCode = "";
    if (row.DataBaseCode) DataBaseCode = row.DataBaseCode;

    o.PropertyUrl = "../Entity/EntityPropertyList.html?EntityTableID=" + row.EntityTableID + "&TableName=" + row.TableName + "&DataBaseCode=" + DataBaseCode;
    $("#formTemplate").tmpl(o).appendTo(td);

    //添加对孙表的描述配置信息，以备提交保存时使用
    var configSun = new Object();
    configSun.ControlName = "sub" + row.EntityTableID + "." + "gridPropertyList";
    configSun.DataName = "EntityPropertyList";
    configSun.ParentField = "EntityTableID";
    configSun.KeyValue = row.EntityTableID;
    configSun.ControlType = "DataGrid";

    if (!configSub.SubRequestList) configSub.SubRequestList = [];
    configSub.SubRequestList.push(configSun);
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

(function () {
    //<a class="mini-button" iconcls="icon-import" onclick="onImportTableClick" plain="true" id="btnImportTable">导入表</a>
    var btns = document.getElementById("btnImportTable");
    if (btns) {
        const copyBtn = document.createElement("a");
        copyBtn.setAttribute("class", "mini-button");
        //supportBtn.setAttribute("onitemclick","menuClick")
        copyBtn.setAttribute("iconcls", "icon-import");
        copyBtn.setAttribute("plain", "true");
        copyBtn.setAttribute("id", "copyTable");
        copyBtn.innerText = "复制表";

        const pasteBtn = document.createElement("a");
        pasteBtn.setAttribute("class", "mini-button");
        //supportBtn.setAttribute("onitemclick","menuClick")
        pasteBtn.setAttribute("iconcls", "icon-import");
        pasteBtn.setAttribute("plain", "true");
        pasteBtn.setAttribute("id", "pasteTable");
        pasteBtn.innerText = "粘贴表";
        btns.insertAdjacentElement("afterend", pasteBtn);
        btns.insertAdjacentElement("afterend", copyBtn);
        console.log("工具注入成功");
        mini.parse();
    }
    else {
        console.warn("开发助手找不到锚点")
        return;
    }
    $("#copyTable").click(function () {
        var mainData = gridTableList.getData();
        if (mainData.length == 0) {
            return;
        }
        var srcMain = mainData[0];
        var newData = {
            Description: srcMain.Description,
            IsAttach: false,
            TableName: "PowerDevTool",
            _id: srcMain._id,
            _showDetail: false,
            _state: "added",
            _uid: srcMain._uid
        }
        targetList = srcMain.EntityPropertyList.map(e => {
            return {
                SerialNo: e.SerialNo,
                FieldType: e.FieldType,
                FieldSize: e.FieldSize,
                FieldScale: e.FieldScale,
                IsAutoInsert: e.IsAutoInsert,
                IsLargeText: e.IsLargeText,
                IsNull: e.IsNull,
                _id: e._id,
                _uid: e._uid,
                _state: "added",
                FieldName: e.FieldName,
                PropertyName: e.PropertyName,
                Description: e.Description
            }
        })
        newData.EntityPropertyList = targetList;
        console.log(newData);
        //CopyToClipboard(JSON.stringify(newData));
        GM_setValue("tableData", newData);
        ExtShow("复制成功!");
    })
    $("#pasteTable").click(function () {
        const data = GM_getValue("tableData", null);
        if (data) {
            //data.EntityID = Guid.NewGuid().ToString();
            data.EntityTableID = Guid.NewGuid().ToString();
            var keyEntity = {
                "EntityKeyID": Guid.NewGuid().ToString(),
                "Columns": "Id",
                "ColumnIDS": "dbdfc60b-e8ac-0ffb-b170-fe1b656efa4d",
                "_state": "added",
                "KeyName": "pk_PB_WpsTemplate",
                "KeyType": "MainKey",
                "TypeName": "主键",
                "IdentityFieldID": "dbdfc60b-e8ac-0ffb-b170-fe1b656efa4d",
                "IdentityFieldName": "Id"
            }
            data.EntityPropertyList = data.EntityPropertyList.map(e => {
                e.EntityPropertyID = Guid.NewGuid().ToString();
                e.EntityTableID = data.EntityTableID;
                if (e.PropertyName.toUpperCase() == "ID") {
                    keyEntity.EntityKeyID = Guid.NewGuid().ToString();
                    keyEntity.Columns = e.PropertyName;
                    keyEntity.IdentityFieldName = e.PropertyName;
                    keyEntity.KeyName = "pk_" + data.TableName + "copy";
                    keyEntity.IdentityFieldID = e.EntityPropertyID;
                    keyEntity.ColumnIDS = e.EntityPropertyID;
                }
                return e;
            });
            data.EntityKeyList = [keyEntity];
            console.log("粘贴成功", data);
            gridTableList.setData([data]);
            gridTableList.select(0);
            var row = gridTableList.getSelected();
            //openPropertyList(row, gridTableList);
            gridTableList.showRowDetail(row);
            var propertyD = document.getElementsByClassName("PropertyListClass")[0];
            if (!propertyD) {
                ExtShow("找不到框架!");
                return;
            }
            //onSetChangeFlag(data.EntityTableID);
            setTimeout(() => {
                propertyD.contentWindow.gridPropertyList.setData(data.EntityPropertyList);
                ExtShow("粘贴成功!");
            }, 800);
        }
        else
            ExtShow("请先复制表!");
    })
})();
