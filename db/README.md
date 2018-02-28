mongodb shell base operations/commond

>MongoDB基本操作

```
$ mongo --nodb //启动时不指定bd
MongoDB shell version v3.6.0
```

### 基本操作列表

- db（查看当前db）
- use [db name]（切换当前db）
- show dbs（查看所有db）
- show collections（查看当前db所有集合）
- db.help()（数据库级别的帮助）
- db.[collection name].find()（查询集合中所有文档/数据）
- db.[collection name].findOne()（查询一条文档/数据）
- db.[collection name].insert()（向集合中添加文档）
- db.[collection name].update()（更新）
- db.[collection name].remove()（删除）
- db.foo.help()（集合级别的帮助）

### 常用命令

- export PATH=/usr/local/mongodb/bin:$PATH（设定环境变量）
- sudo mongod --config etc/mongod.conf（使用config文件启动mongodb）
- lsof -i:27017（查询端口进程）
- kill -15 port（关闭进程）
- sudo mongod --dbpath ../mongo（启动时指定数据库文件地址）








