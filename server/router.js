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

const byError = async (ctx, next)=>{
	const { startTime, endTime, url, host } = ctx.request.query;
	const timeRule = getTimeRule(startTime,endTime);
	await Error
		.aggregate([
			{
				$match:timeRule,
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

module.exports = { byError,getTimeRule };