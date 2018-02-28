mongodb shell base operations/commond

>MongoDB基本操作


### 基本操作列表

- db（查看当前db）
- use [db name]（切换当前db）
- show dbs（查看所有db）
- show collections（查看当前db所有集合）
- db.[collection name].find()（查询集合中所有文档/数据）
- db.[collection name].insert()（向集合中添加文档）

###常用命令

- export PATH=/usr/local/mongodb/bin:$PATH（设定环境变量）
- sudo mongod --config etc/mongod.conf（使用config文件启动mongodb）
- lsof -i:27017（查询端口进程）
- kill -15 port（关闭进程）
- sudo mongod --dbpath ../mongo（启动时指定数据库文件地址）








