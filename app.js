const Koa = require('koa');
const Router = require('koa-router');
const Views = require('koa-view');
const Statics = require('koa-static');
const mongoose = require('mongoose');//db
const koaBody = require('koa-body');

const router = new Router();

const { transferByMap } = require('./server/sourcemap');
const { ErrorSchema } = require('./db/schema');

const host = {
	dev: 'mongodb://localhost/test',
	test: 'mongodb://172.16.101.38:27017/error'
}
mongoose.connect(host.test);

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
router.get('/api/insertError', async (ctx, next)=>{
	console.log('-----rqt');
	console.log(ctx.request.query.data);
	const data = ctx.request.query.data
	const { info, stack, url, col, line, time, browser, page, screen } = JSON.parse(data);
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
			info: info || 'error',
			stack: stack || [],
			url: url || '',
			host: host || '',
			col: col,
			page: page,
			line: line,
			time: time,
			browser: browser,
			screen: screen||'0 x 0'
		},numInfo)
	);

	//mongoose save a record  in mongodb named test
	await pusher.save(function (err) {
		if (err) {
			console.error('======save error======');
		}
		console.log('get a error');
		ctx.response.body  = 'success';
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
	console.log('-----rqt query');
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
	    err && return console.log(err);

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
	console.log(ctx.request.body);
	ctx.response.status = 500;
});


app.listen(3000, function(){
	console.log('listen to ------ 3000')
});


module.exports = router;