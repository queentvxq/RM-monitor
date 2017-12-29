const sourceMap = require("source-map");
const fs = require("fs");

exports.transferByMap = async (line, col, filename)=>{
	const info = await complier(line, col, filename);
	return info;
}

const url = {
	assist:'https://git.cai-inc.com/ZCY-FE/zcy-assist-front/raw/master/maps/assets_assist/scripts/',
}

const complier = (line, col, filename)=>{
	return fs.readFile(`${url.assist}${filename}.map`, 'utf8', function (err, data) {
		const _num = { 
			line: line,
			column: col 
		};
		if (err) {
			console.log('do not find map file,Error: ' + err);
			return _num;
		}

	    const consumer = new sourceMap.SourceMapConsumer(JSON.parse(data));
		const numInfo = consumer.originalPositionFor(_num);
		return numInfo;
	});
}
