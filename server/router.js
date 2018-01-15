const mongoose = require('mongoose');//db
const { ErrorSchema } = require('../db/schema');

// data model
const Error = mongoose.model('Error', ErrorSchema);

const getTimeRule = (startTime,endTime)=>{
	const _st = new Date(startTime||"2000-01-01T00:00:00Z");
	const _et = new Date(endTime||"9999-01-01T00:00:00Z");
	const timeRule = {
		"time":{
			$gte:_st,
			$lte:_et
		}
	};
	return timeRule;
}

const byHost = async (ctx, next)=>{
	const { startTime, endTime, url, host, page } = ctx.request.query;
	const timeRule = getTimeRule(startTime,endTime);
	await Error.aggregate([
		{
			$match:timeRule,
		},
		{
			$match:{page:{$regex:page}},
		},
		{
			$group:{
				_id : { host: '$host',url: '$url' },
				info: { $push: "$info"},
				size: { $sum: 1 }
			}
		},
		{
			$sort:{size:-1}
		},
		{
			$group:{
				_id : '$_id.host',
				list: { $push: {url:'$_id.url',info:'$info'} },
				size: { $sum:1 }
			}
		},
		{
			$sort:{size:-1}
		}
	]).exec(function(err,lists){
		// console.log(JSON.stringify(lists))
		ctx.response.body = JSON.stringify(lists);
	});
	await next();
	ctx.response.status = 200;
}

const byError = async (ctx, next)=>{
	const { startTime, endTime, url, host, page } = ctx.request.query;
	const timeRule = getTimeRule(startTime,endTime);
	await Error
		.aggregate([
			{
				$match:timeRule,
			},
			{
				$match:{page:{$regex:page}},
			},
			{   

				$group:{
					_id: {page: '$page',info: '$info'},
					list: {$push: {url:'url'}},
					size: {$sum:1}
				}
			},
			{
				$sort:{size:-1}
			}
		])
		.limit(100)
		.exec(function(err,lists){
			ctx.response.body = JSON.stringify(lists);
		});
	await next();
	ctx.response.status = 200;
}

const query = async (ctx, next)=>{
	console.log('-----rqt query');
	const { startTime, endTime, url, host, page } = ctx.request.query;

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
	.find({"page":{$regex:page}})
	.sort({"time" : -1})
	.limit(100)
	.exec(function(err, errors){
		if(err) {
			return console.log(err);
		}

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
}

module.exports = { byError,getTimeRule, query, byHost };