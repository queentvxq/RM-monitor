```javascript
{
  version : 3,//sourcemap版本
  file: "out.js",//转换后的文件名
  sourceRoot : "",//源文件路径
  sources: ["foo.js", "bar.js"],//源文件名，该项是一个数组，表示可能存在多个文件合并。
  names: ["src", "maps", "are", "fun"],//变量（属性）名
  mappings: "AAgBC,SAAQ,CAAEA"//记录位置信息的字符串
}
```

## mappings

* 第一位，表示这个位置在（转换后的代码的）的第几列。
* 第二位，表示这个位置属于sources属性中的哪一个文件。
* 第三位，表示这个位置属于转换前代码的第几行。
* 第四位，表示这个位置属于转换前代码的第几列。
* 第五位，表示这个位置属于names属性中的哪一个变量。
