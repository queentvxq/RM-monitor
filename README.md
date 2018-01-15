front-end error monitor and analysis tool

>当代码迭代到一定量的时候，功能测试和code review也只能解决一部分问题，前端错误日志中才能发现一些隐藏的很深的问题，所有的这一切都需要从数据采集开始，合理的错误埋点和前端监控才能让系统变得更健康。

查看地址： http://172.16.101.38:3000/

### 主要功能及特性

- 捕获前端代码异常并上报；
- 捕获cdn文件加载异常并上报；
- 查看报错页面地址、错误代码地址及位置、错误信息、错误堆栈、报错时用户浏览器信息、页面分辨率；
- sourcemap映射压缩前文件位置；
- 配合webpack sourcemap 追溯合并、压缩前文件路径及位置(待集成)；
- 统计同一页面统一错误报错次数，支持排序；
- 统计同一域名（项目）报错页面个数，以及同一文件报错次数，支持排序；
- 支持按日期查找，对比本周/上周报错情况，获取错误情况数据；
- 图表展示，更直观显示、分析错误状态(待集成)；
- 对接邮件系统，统计当日报错信息情况，同步至相关人员(待集成)；
- 对接邮件系统，实时通知相关开发测试线上报错情况(待集成)；
- 选择报错文件，输入行列，得出映射后地址(支持gulp,待集成)；

一.错误捕获
==========
## 1.代码异常捕获


堆栈浏览器兼容：

```javascript
/**

* @param {String} e 错误信息

* @param {String} url 出错的文件

* @param {Long} line 出错代码的行号

* @param {Long} col 出错代码的列号

* @param {Object} error 错误的详细信息，可能包含堆栈

*/

window.onerror = function(e, url, line, col, error) {

 // code..

}
```

## 2.CDN加载异常

```html
<link rel="stylesheet" href="https://sitecdn.zcy.gov.cn/finance-login/styles/qwhjhqjw.css?_=12121" onerror="errorFromCDN('https://sitecdn.zcy.gov.cn/finance-login/styles/qwhjhqjw.css?_=12121')">
```

二.错误上报
========== 

 jsonp:
```html
<image src='reportURL' width='0' height='0'></image>
```
三.错误信息存储
==========
```javascript
ErrorSchema = new Schema({

info: String,//其他错误信息

stack: [String],//错误堆栈信息

time: {type: Date, index: true},//错误生成时间

url: String,//报错文件地址

host: String,//错误域名（用于定位项目）

page: String,//页面地址

column: Number,//错误列

line: Number,//错误行

browser: String,//报错浏览器信息

name: String,//sourcemap指向位置的代码信息

screen: String//用户屏幕分辨率

});
```
四.基本使用
==========

## 1.按时间搜索：最小维度到天
## 2.按项目（页面）地址搜索
### 线上问题辅助解决方案：
- 错误位置将会根据sourcemap，将压缩后的报错行/列信息，映射至压缩前。
- 查看报错行/列信息
- 将本地代码切换至与线上同一分支(版本)后启动服务
- 或部署至dev环境
- 在本地对应文件中找到该行/列，查找错误原因
## 3.错误统计：按相同页面，同一错误信息，发生次数排序，展示前100。
- 可按日期搜索，对比本周与上周，错误状态；
- 可按页面地址搜索，查看相同位置报错的修复状态；
## 4.错误统计：按照同一域名下，报错页面个数统计，再细分报错文件，统计报错次数。
## 5.图表展示，更直观显示、分析错误状态；
## 6.对接邮件系统，实时通知相关开发测试线上报错情况；
## 7.对接邮件系统，统计当日报错信息情况，同步至相关人员；
