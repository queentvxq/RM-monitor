const Koa = require('koa');
const Router = require('koa-router');
const Views = require('koa-view');
const mongoose = require('mongoose');//db
const koaBody = require('koa-body');

const router = new Router();
const Schema = mongoose.Schema;
// var userSchema = new Schema({
//     name: String,
//     pass: String,
//     email: String,
//     createTime: Date,
//     lastLogin: Date
// });

mongoose.connect('mongodb://localhost/test');
const app = new Koa();

app
	.use(koaBody())//to get response body
	.use(Views(__dirname, { extension: 'html' }))//register pages
	.use(router.routes())
	.use(router.allowedMethods())

// data model
const ErrorSchema = new Schema({
  info: String,
  stack: [String],
  time: {type: Date, index: true},
  url: String,
  host: String,
  col: Number,
  line: Number
})

const Error = mongoose.model('Error', ErrorSchema);

//index.html
router.get('/', async (ctx, next) => {
  await next();
  await ctx.render('index');
})

//insert reported error into db
router.post('/api/insertError', async (ctx, next)=>{
	console.log('-----rqt');
	// debugger;
	console.log(ctx.request.body);
	console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
	const { info, stack, url, col, line, time } = ctx.request.body
	// new Obj named pusher
	// set pusher attributes
	const suffix = url.split('//')[1]//
	const host = suffix.split('/')[0]
	const pusher = new Error({ 
		info: info || 'undefined',
		stack: stack || [],
		url: url.split(host)[1] || '/main',
		host: host || 'middle.zcy.gov.cn',
		col: col,
		line: line,
		time: time
	});

	//mongoose save a record  in mongodb named test
	await pusher.save(function (err) {
		if (err) // ...
		console.log('get a error');
		ctx.response.body  = 'success'
		// ctx.response.json({
  		//     message : 'success'
  		// });
	});
	await next();
	ctx.response.status = 200;
});

//query data from db
router.get('/api/query', async (ctx, next)=>{
	console.log('-----rqt');
	console.log(ctx.request.body);
	const { startTime, endTime, url, host } = ctx.request.body

	//query by host
	// ErrorSchema.query.byHost = function(host){
	//     return this.find({host: new RegExp(name, "ig")});
	// }
	
	await Error.find().exec(function(err, errors){
	    // err && return console.error(err);
	    console.log('================');
	    console.log(errors);
	    console.log(errors.length);
	    ctx.response.body = JSON.stringify({errors})
	});
	await next();
	ctx.response.status = 200;
});



app.listen(3005, function(){
	console.log('listen to ------ 3005')
});


module.exports = router;