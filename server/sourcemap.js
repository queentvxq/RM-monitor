const sourceMap = require("source-map");
const fs = require("fs");
const request = require('request');

const url = {
	assist:'https://git.cai-inc.com/ZCY-FE/zcy-assist-front/raw/master/maps/assets_assist/scripts/',
}

exports.transferByMap = async (line, col, filename)=>{
	const info = await complier(line, col, filename);
	return info;
}

const complier = async (line, col, filename)=>{
	console.log(`${filename}.map`);
	return new Promise((resolve, reject) => {
		request.get({
			url:`${url.assist}${filename}.map`,
			json:true
		}, function (error, response, data) {
		    const _num = { 
					line: line,
					column: col 
				};
		    if (!error && response.statusCode == 200) {
		        // Continue with your processing here.
		        console.log('========compiling========')
			    const consumer = new sourceMap.SourceMapConsumer(data);
				const numInfo = consumer.originalPositionFor(_num);
				console.log(numInfo);
				resolve(numInfo);
				return numInfo;

		    }else {
		    	console.log('do not find map file,Error: ' + error);
				console.log(`${url.assist}${filename}.map`);
				resolve(_num);
				return _num;
		    }
		});
    })
	
}
