const Koa = require('koa');
const Router = require('koa-router');
const Views = require('koa-view');
const Statics = require('koa-static');
const mongoose = require('mongoose');//db
const koaBody = require('koa-body');

const router = new Router();

const { transferByMap } = require('./server/sourcemap');
const { ErrorSchema } = require('./db/schema');
const server = require('./server/router');
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

const getFilenameByURL = function(url) {
	const _arr = url.split('/');
	const l = _arr.length;
	return _arr[l-1];
}

//insert reported error into db
router.get('/api/insertError', async (ctx, next)=>{
	console.log('-----rqt');
	console.log(ctx.request.query.data);
	const data = ctx.request.query.data
	const { info, stack, url, column, line, time, browser, page, screen } = JSON.parse(data);

	//sourcemap transfer line&col info
	let numInfo = {};
	const filename = getFilenameByURL(url);
	console.log(filename);
	if(line && line > 0 && filename.indexOf('js')){
		numInfo = await transferByMap (line, column, filename);
		console.log('======= complier success =======');
	}
	console.log(numInfo);
	console.log('=======numInfo========')
	// new Obj named pusher
	// set pusher attributes
	const suffix = page.split('//')[1]//
	const host = suffix.split('/')[0]//页面域名区分项目
	const pusher = new Error(
		Object.assign({
			info: info || 'error',
			stack: stack || ['cdn load error'],
			url: url || '',//报错文件地址
			host: host || '',
			column,
			page,//页面地址
			line,
			time,
			browser: browser,
			screen: screen||'0 x 0'
		},numInfo)
	);

	//mongoose save a record  in mongodb named test
	await pusher.save(function (err) {
		if (err) {
			console.log('======save error======');
		}
		console.log('=========get a error=========');
		ctx.response.body  = 'success';
	});
	await next();
	ctx.response.status = 200;
});

router.get('/api/analysis/byHost', server.byHost);

router.get('/api/analysis/byError', server.byError);

//query data from db
router.get('/api/query', server.query);

router.get('/api/test', async (ctx, next)=>{
	console.log(ctx.request.body);
	ctx.response.status = 500;
});


app.listen(3000, function(){
	console.log('listen to ------ 3000')
});


module.exports = router;