## M3平台开发助手

使用[油猴脚本](https://www.tampermonkey.net/)将自己写的脚本代码注入到网页运行环境, 读取页面js变量代码,关键信息使用ajax共享当前页面的会话调用后台接口获取。
理论上公司所有用**miniui**的站点, 都能使用助手获取**页面链接,关键词**等开发信息,因为是浏览器注入的方式,和站点隔离,不会对运行中的代码有影响,客户运行环境不会有多余的代码.
## 准备安装
![油猴](https://tse1-mm.cn.bing.net/th/id/OIP-C.kuyPZC2VpjoE7dDTw5VczQAAAA?pid=ImgDet&rs=1)

1. 因为本插件依赖于油猴运行,所以必须安装油猴.
2. 可以安装油猴脚本的浏览器(chrome,360极速,edge,Safari,Firefox,opera...)均可使用本助手,其他浏览器安装方法可以查阅官网,本安装教程只提供chromium内核的浏览器crx格式的油猴拓展安装.
### 1. 安装油猴
#### 1.1 在线安装
科学上网的用户可以直接[官网下载](https://www.tampermonkey.net/),跳转到谷歌官方扩展商店下载安装.
#### 1.2 离线安装
1. 解压**油猴离线包.rar**,进入到有```userscript.html```文件的目录,复制这个文件夹路径
2. 打开你的Chrome浏览器的 更多工具>扩展程序页面.
或者直接在网址输入: ```chrome://extensions/```
3. 点击右上角 **开发者模式** 开关 
4. 再点击左上角 "**添加已解压的扩展程序**"
5. 打开复制的文件夹路径,点击确认
### 2. 安装自定义脚本

点击浏览器扩展栏的油猴脚本图标, ```点击添加新脚本```直接把用```PowerDevTool.js```的内容复制到新建脚本,然后按```Ctrl+S```保存即可.
![截图1](https://github.com/computewarrior/PowerDevTool/blob/master/tutorials/%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%AE%9A%E4%B9%89%E8%84%9A%E6%9C%AC.gif?raw=true)
打开应用平台查看,右下角出现助手的图标说明安装完成
## 功能
运行效果
![3](/tutorials/1.jpg)
询问是否运行
![1](/tutorials/1.jpg)
主菜单页面
![2](/tutorials/1.jpg)
### 源码
点击会复制当前窗体或表单的地址,而不是外层主菜单地址
### 运行
在站点点击运行即可弹出助手,如果不需要在当前站点运行,点击关闭会排除当前站点.**如果需要重新运行,需要F12控制台输入```$("#ReStart").click()```然后回车调用注册的重新运行按钮,会把站点重新加入白名单**
### 获取开发信息

点击按钮后,以下开发信息会写入**剪贴板**,包括层级,当前页面地址,物理文件地址,登录人员账号,页面类型等等,动手能力强的同事可以参考[自己配置控制器获取更多信息](#自己配置控制器获取更多信息)

```
链接地址 : http://dev.p3china.com:7608/Form/EditForm/20c53deb-d70f-4eb3-b126-683fa3852200/
关键词:RGY_PM_MonthBudget
当前窗体Id:20c53deb-d70f-4eb3-b126-683fa3852200
弹出窗体Id:ffeed391-45aa-4b03-920f-206ff02d6964
用户帐号:admin
用户名称:admin
所属层级 : 某某研究院有限公司
窗体地址 : \PowerPlat\FormXml\zh-CN\RGY_PM\Win_RGY_PM_MonthBudget.htm
页面类型 : 静态页面
单点登陆地址 : 这里配置单点登录地址
问题描述 : 
```
### 清除权限缓存
调用系统运行状态功能的清除权限按钮
### 问题反馈
可以配置为前往任意bug反馈平台,默认配置为M3的交流群
### 新窗口打开
独立的页面打开窗口表单,方便查看开发者工具查看源码输出
### 打开源窗口
打开地址为服务器文件路径未被服务器处理的静态html文件
### 获取字段信息
获取当前页面配置主业务对象的字段名称(对应对象为formconfig.config.joindata.currow)
### 关闭助手
助手运行后需要排除网站,点击关闭助手功能,然后再点关闭,可以排除当前站点,需要重新运行需参考[运行](#运行)的功能介绍
## 获取链接
## 自己配置控制器获取更多信息
项目控制器配置参考[帮助平台关于控制器的配置](https://www.yuque.com/haishan-p9cvk/cb4yeb/lg31bt)

可以使用 **/控制器别名/GetWidgetAndMenu/{widgetid}** 替换 */Form/GridPageLoad* 接口获取数据(本接口使用redis缓存窗体菜单数据,不用担心性能,清除缓存可以调用 */控制器别名/ClearJsonCache* )

示例

控制器后台代码
```csharp
      #region 获取菜单窗体
        IEnumerable<Models.MainMenu> FindParentMenu(Guid menuId, IEnumerable<Models.MainMenu> list, IEnumerable<Models.MainMenu> retList)
        {
            var matchMenu = list.Where(s => s.Id == menuId).FirstOrDefault();
            if ( matchMenu == null )
                return retList;
            else
            {
                var newlist = retList.ToList();
                newlist.Add(matchMenu);
                return FindParentMenu(matchMenu.ParentId, list, newlist);
            }
        }
        /// <summary>
        /// 获取窗体的菜单和表单路径
        /// </summary>
        /// <param name="widgetId"></param>
        /// <returns></returns>
        [Action]
        public string GetWidgetAndMenu(string widgetId)
        {
            var result = Power.Global.ViewResultModel.Create(false, "获取对应关系");
            try
            {
                var widgetGuid = Guid.Parse(widgetId);
                if ( this.Context != null && this.Context.Response != null )
                {
                    this.Context.Response.ContentType = "application/json;charset=utf-8";
                }
                var widgetList = this.GetWidget();
                var currentWidgetList = widgetList.Where(s => s.Id == widgetGuid || s.OpenFormId == widgetGuid).Select(s =>
                {
                    s.HtmlPath = this.formatHtmlpath(s.HtmlPath);
                    return s;
                });
                //    var widgetOpt = Business.BusinessFactory.CreateBusinessOperate("Widget");
                //  var widgetBo = widgetOpt.FindByKey(widgetId);
                if ( currentWidgetList.Count() == 0 )
                    throw new Exception("根据窗体Id找不到窗体");
                var currentWidget = currentWidgetList.First();
                if ( currentWidgetList.Count() == 1 )
                {
                    var widget = currentWidgetList.First();
                    result.data.Add("Widget", Convert.ToString(widget.Name) + " > " + Convert.ToString(widget.HtmlPath));
                    if ( widget.OpenFormId != null )
                    {
                        var formBo = widgetList.Where(s => s.Id == widget.OpenFormId).FirstOrDefault();
                        if ( formBo != null )
                            result.data.Add("Form", formBo.Name + " > " + formBo.HtmlPath);
                    }
                }
                else
                {
                    var list = currentWidgetList.ToList();
                    for ( var i = 0; i < list.Count; i++ )
                    {
                        if ( list[i].OpenFormId != null )
                        {
                            if ( result.data.ContainsKey("Widget") )
                                result.data.Add("Widget" + i, list[i].Name + " > " + list[i].HtmlPath);
                            else
                                result.data.Add("Widget", list[i].Name + " > " + list[i].HtmlPath);
                            currentWidget = list[i];

                        }
                        else
                        {
                            if ( result.data.ContainsKey("Form") )
                                result.data.Add("Form" + i, list[i].Name + " > " + list[i].HtmlPath);
                            else
                                result.data.Add("Form", list[i].Name + " > " + list[i].HtmlPath);
                        }
                    }
                }
                //var menuWidgetOpt = Business.BusinessFactory.CreateBusinessOperate("MenuWidget");
                //var mainMenuBO = menuWidgetOpt.FindAll("WidgetId='"+widgetId+"'","","",0,0,SearchFlag.IgnoreRight).FirstOrDefault();
                var menuWidgetList = this.GetMenuWidget();
                var mainMenuBO = menuWidgetList.Where(s => s.WidgetId == currentWidget.Id).FirstOrDefault();
                if ( mainMenuBO == null )
                {
                    result.success = true;
                    return result.ToJson();
                }
                var menuId = mainMenuBO.MenuId;
                var menuObjList = this.GetMenus();
                var paramList = new List<Models.MainMenu>();
                var retList = FindParentMenu(menuId, menuObjList, paramList);
                result.detail = String.Join(" > ", retList.Select(s => s.Name).Reverse());
                result.data.Add("Menu", result.detail);
                result.data.Add("value", retList);
                result.success = true;
            }
            catch ( Exception ex )
            {
                result.message = ex.Message;
            }
            return result.ToJson();
        }
        string formatHtmlpath(string path)
        {
            if ( path.IndexOf("/PowerPlat/FormXml/zh-CN/") > -1 )
                return path;
            else
                return "/PowerPlat/FormXml/zh-CN/" + path.Replace("\\", "/");
        }
        IEnumerable<Models.MainMenu> GetMenus()
        {
            string key = "ExtentionsMenu";
            if ( Power.Global.PowerGlobal.Cache.Exists(key) )
            {
                string json = Power.Global.PowerGlobal.Cache.Get<string>(key);
                return Newtonsoft.Json.JsonConvert.DeserializeObject<IEnumerable<Models.MainMenu>>(json);
            }
            var menuOpt = Business.BusinessFactory.CreateBusinessOperate("MainMenu");
            var boList = menuOpt.FindAll("", "", "Id,ParentId,Name", 0, 0, SearchFlag.IgnoreRight);
            var retList = boList.Select(s => new Models.MainMenu() { Id = Guid.Parse(Convert.ToString(s["Id"])), ParentId = Guid.Parse(Convert.ToString(s["ParentId"])), Name = Convert.ToString(s["Name"]) });
            Power.Global.PowerGlobal.Cache.Set<string>(key, Newtonsoft.Json.JsonConvert.SerializeObject(retList));
            return retList;
        }
        IEnumerable<Models.Widget> GetWidget()
        {
            string key = "ExtentionsWidget";
            if ( Power.Global.PowerGlobal.Cache.Exists(key) )
            {
                string json = Power.Global.PowerGlobal.Cache.Get<string>(key);
                return Newtonsoft.Json.JsonConvert.DeserializeObject<IEnumerable<Models.Widget>>(json);
            }
            var opt = Business.BusinessFactory.CreateBusinessOperate("Widget");
            var boList = opt.FindAll("", "", "Id,Name,HtmlPath,ExtJson", 0, 0, SearchFlag.IgnoreRight);
            var retList = boList.Select(s =>
            {
                var ret = new Models.Widget()
                {
                    Id = Guid.Parse(Convert.ToString(s["Id"])),
                    Name = Convert.ToString(s["Name"]),
                    HtmlPath = Convert.ToString(s["HtmlPath"])//优化html格式
                };
                var json = Convert.ToString(s["ExtJson"]);
                var formconfig = Newtonsoft.Json.JsonConvert.DeserializeObject<Models.FormConfig>(json);
                if ( formconfig != null && formconfig.config != null && formconfig.config.openformid != null )
                {
                    ret.OpenFormId = formconfig.config.openformid;
                }
                return ret;
            });
            Power.Global.PowerGlobal.Cache.Set<string>(key, Newtonsoft.Json.JsonConvert.SerializeObject(retList));
            return retList;
        }
        IEnumerable<Models.MenuWidget> GetMenuWidget()
        {
            string key = "ExtentionsMenuWidget";
            if ( Power.Global.PowerGlobal.Cache.Exists(key) )
            {
                string json = Power.Global.PowerGlobal.Cache.Get<string>(key);
                return Newtonsoft.Json.JsonConvert.DeserializeObject<IEnumerable<Models.MenuWidget>>(json);
            }
            var menuOpt = Business.BusinessFactory.CreateBusinessOperate("MenuWidget");
            var boList = menuOpt.FindAll("", "", "MenuId,WidgetId", 0, 0, SearchFlag.IgnoreRight);
            var retList = boList.Select(s => new Models.MenuWidget() { MenuId = Guid.Parse(Convert.ToString(s["MenuId"])), WidgetId = Guid.Parse(Convert.ToString(s["WidgetId"])) });
            Power.Global.PowerGlobal.Cache.Set<string>(key, Newtonsoft.Json.JsonConvert.SerializeObject(retList));
            return retList;
        }
        [Action]
        public string ClearJsonCache()
        {
            var result = Power.Global.ViewResultModel.Create(false, "清除json缓存");
            try
            {
                var list = new List<string>() { "ExtentionsMenuWidget", "ExtentionsWidget", "ExtentionsMenu" };
                Power.Global.PowerGlobal.Cache.Dels(list);
                result.success = true;
            }
            catch ( Exception ex )
            {
                result.message = ex.Message;
            }
            return result.ToJson();
        }      
        #endregion
```

返回数据示例

```json
{
    "success": true,
    "message": "获取对应关系",
    "detail": "横向项目 > 成本管理 > 项目月度资金计划",
    "list": null,
    "msgList": null,
    "data": {
        "value": [
            {
                "Id": "6aa769f4-ac43-b305-deb2-d5d029a7f2b8",
                "ParentId": "036e6f89-a3ae-b101-aa59-3e5942b3e0bd",
                "Name": "项目月度资金计划"
            },
            {
                "Id": "036e6f89-a3ae-b101-aa59-3e5942b3e0bd",
                "ParentId": "62343811-cf50-3822-0022-d50f52751bd2",
                "Name": "成本管理"
            },
            {
                "Id": "62343811-cf50-3822-0022-d50f52751bd2",
                "ParentId": "00000000-0000-0000-0000-000000000000",
                "Name": "横向项目"
            }
        ],
        "Form": "项目月度资金计划 > /PowerPlat/FormXml/zh-CN/RGY_PM/RGY_PM_MonthBudget.htm",
        "Menu": "横向项目 > 成本管理 > 项目月度资金计划",
        "Widget": "项目月度资金计划 > /PowerPlat/FormXml/zh-CN/RGY_PM/Win_RGY_PM_MonthBudget.htm"
    }
}
```