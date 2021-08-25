## M3平台开发助手

使用[油猴脚本](https://www.tampermonkey.net/)将自己写的脚本代码注入到网页运行环境, 读取页面js变量代码,关键信息使用ajax共享当前页面的会话调用后台接口获取。
理论上公司所有用**miniui**的站点, 都能使用助手获取**页面链接,关键词**等开发信息,因为是浏览器注入的方式,和站点隔离,不会对运行中的代码有影响,客户运行环境不会有多余的代码.
## 准备安装
![油猴](https://tse1-mm.cn.bing.net/th/id/OIP-C.kuyPZC2VpjoE7dDTw5VczQAAAA?pid=ImgDet&rs=1)

1. 因为本插件依赖于油猴运行,所以必须安装油猴.
2. 可以安装油猴脚本的浏览器(chrome,360极速,edge,Safari,Firefox,opera...)均可使用本助手,其他浏览器安装方法可以查阅官网,本安装教程只提供chromium内核的浏览器crx格式的油猴拓展安装.
### 安装油猴
#### 在线安装
科学上网的用户可以直接[官网下载](https://www.tampermonkey.net/),跳转到谷歌官方扩展商店下载安装.
#### 离线安装
1. 解压**油猴离线包.rar**,进入到有```userscript.html```文件的目录,复制这个文件夹路径
2. 打开你的Chrome浏览器的 更多工具>扩展程序页面.
或者直接在网址输入: ```chrome://extensions/```
3. 点击右上角 **开发者模式** 开关 
4. 再点击左上角 "**添加已解压的扩展程序**"
5. 打开复制的文件夹路径,点击确认
### 安装自定义脚本

点击浏览器扩展栏的油猴脚本图标, ```点击添加新脚本```直接把用```PowerDevTool.js```的内容复制到新建脚本,然后按```Ctrl+S```保存即可.
![截图1](https://bestanimations.com/Nature/summer/summer-nature-animated-gif-19.gif)
打开应用平台查看,右下角出现助手的图标说明安装完成
## 功能
## 排除网站
## 获取链接
## 自己DIY脚本
