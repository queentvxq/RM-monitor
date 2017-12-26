const mongoose = require('mongoose');//db
const Schema = mongoose.Schema;

exports.ErrorSchema = new Schema({
  info: String,//其他错误信息
  stack: [String],//错误堆栈信息
  time: {type: Date, index: true},//错误生成时间
  url: String,//报错文件地址
  host: String,//错误域名（用于定位项目）
  col: Number,//错误列
  line: Number,//错误行
  browser: String,//报错浏览器信息
  name: String,//sourcemap指向位置的代码信息
  screen: String//用户屏幕分辨率
});