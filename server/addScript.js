var fs = require('fs');

fs.readFile('./views/layout.hbs', 'utf8', function(err, data) {
	if (err) throw err;

	console.log('read file complete');
	var newData = data.replace('</head>', '<script src="http://172.16.101.38:8080/libs/ZCYPerf.js"></script></head>')

	console.log('add performance tag complete');
	var newData = data.replace('<head>', '<head><script src="http://172.16.101.38:3000/browser/onerror.js"></script>')
	console.log('add error-catch tag complete');
	data.replace('/href="(\w+)\s*cdn\s*(\w+)"/', 'href="$1cdn$2" onerror="errorFromCDN(\'$1cdn$2\'"');
	console.log(newData);
	fs.writeFile('./views/layout.hbs', newData, 'utf8', function(err) {
	if (err) throw err
	})
})