const Koa = require('koa');
const Router = require('koa-router');
const Views = require('koa-view');
const Statics = require('koa-static');
const mongoose = require('mongoose');//db
const koaBody = require('koa-body');

const router = new Router();

const { transferByMap } = require('./server/sourcemap');
const { ErrorSchema } = require('./db/schema');

mongoose.connect('mongodb://172.16.101.38:27017/error');
const app = new Koa();

app
	.use(koaBody())//to get response body
	.use(Views(__dirname, { extension: 'html' }))//register pages
	.use(Statics(__dirname))
	.use(router.routes())
	.use(router.allowedMethods())

// data model
const Error = mongoose.model('Error', ErrorSchema);

//index.html
router.get('/', async (ctx, next) => {
  await next();
  await ctx.render('../index');
})

//insert reported error into db
router.post('/api/insertError', async (ctx, next)=>{
	console.log('-----rqt');
	// debugger;
	console.log(ctx.request.body);
	console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
	const { info, stack, url, col, line, time, browser } = ctx.request.body;
	//sourcemap transfer line&col info
	let numInfo = {};
	if(line && line > 0){
		numInfo = transferByMap (line, col, 'app.js');
	}
	console.log('======= complier success =======');
	console.log(numInfo);
	console.log('')
	// new Obj named pusher
	// set pusher attributes
	const suffix = url.split('//')[1]//
	const host = suffix.split('/')[0]
	const pusher = new Error(
		Object.assign({
			info: info || 'undefined',
			stack: stack || [],
			url: url.split(host)[1] || '/main',
			host: host || 'middle.zcy.gov.cn',
			col: col,
			line: line,
			time: time,
			browser: browser
		},numInfo)
	);

	//mongoose save a record  in mongodb named test
	await pusher.save(function (err) {
		if (err) {
			console.error('======save error======');
		}
		console.log('get a error');
		ctx.response.body  = 'success'
		// ctx.response.json({
  		//     message : 'success'
  		// });
	});
	await next();
	ctx.response.status = 200;
});

Error.aggregate(
	{
		$group:{
			_id: { host: '$host',url: '$url' },
			info : {$push: "$info"}
		}
	},
	{
		$group:{
			_id:'$_id.host',
			list: {$push: {url:'$_id.url',info:'$info'}}
		}
	},
).exec(function(err,lists){
	console.log(JSON.stringify(lists))
});

//query data from db
router.get('/api/query', async (ctx, next)=>{
	console.log('-----rqt');
	console.log(ctx.request.query);
	const { startTime, endTime, url, host } = ctx.request.query;

	//query by host
	// ErrorSchema.query.byHost = function(host){
	//     return this.find({host: new RegExp(name, "ig")});
	// }
	const _st = new Date(startTime||0).getTime();
	const _et = new Date(endTime||999999999999999).getTime();
	const timeRule = {
		"time":{
			$gte:_st,
			$lte:_et
		}
	};
	await Error.find(timeRule)
	.sort({"time" : -1})
	.limit(10)
	.exec(function(err, errors){
	    // err && return console.error(err);
	    console.log('================');
	    // console.log(errors);
	    console.log(errors.length);
	    const _errors = errors.map((error)=>{
	    	const time = error.time;
	    	let _time = "";
	    	if(time) {
	    		_time = time.getFullYear()+"/"+(time.getMonth()+1)+"/"+time.getDate()+" "
	    		+ time.getHours() + ":" + time.getMinutes();
	    	}
	    	// error.localtime = _time;
	    	// console.log(error);
	    	return Object.assign({},error._doc,{localtime:_time});
	    })
	    ctx.response.body = JSON.stringify({errors:_errors,success:'true'})
	});
	await next();
	ctx.response.status = 200;
});

router.get('/api/test', async (ctx, next)=>{
	console.log(ctx.requesteee.body);
	ctx.response.status = 500;
});


app.listen(3000, function(){
	console.log('listen to ------ 3000')
});


module.exports = router;