const sourceMap = require("source-map");
const fs = require("fs");

export const transferByMap = async (line, col, filename)=>{
	const info = await complier(line, col, filename);
	return info;
}

const complier = (line, col, filename)=>{
	return fs.readFile(`./source-map/${filename}.map`, 'utf8', function (err, data) {
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
