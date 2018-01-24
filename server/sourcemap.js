const sourceMap = require("source-map");
const fs = require("fs");
const request = require('request');

const url = {
	assist:'https://git.cai-inc.com/ZCY-FE/zcy-assist-front/raw/master/maps/assets_assist/scripts/',
	annoucement: 'https://git.cai-inc.com/ZCY-FE/zcy-annoucement-front/raw/master/maps/assets/scripts/',
	middle: 'https://git.cai-inc.com/ZCY-FE/web-union/raw/master/maps/assets/scripts/',
	statistics: ''
}
const transferByMap = async (line, col, filename, path)=>{
	let map_url = '';
	//match map by project on git
	for(let key in url){
		if(path.indexOf(key) > -1)map_url = url[key]
	}
	console.log(map_url);
	const info = await complier(line, col, filename, map_url);
	return info;
}

const complier = async (line, col, filename, map_url)=>{
	console.log(`${filename}.map`);
	return new Promise((resolve, reject) => {
		request.get({
			url:`${map_url}${filename}.map`,
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
				if(numInfo && numInfo.line && numInfo.column){
					resolve(numInfo);
					return numInfo;
				}
				else{
					resolve(_num);
					return _num;
				}

		    }else {
		    	console.log('do not find map file,Error: ' + error);
				console.log(`${url.assist}${filename}.map`);
				resolve(_num);
				return _num;
		    }
		});
    })
	
}


class transferStack {
  	constrctor(stack ,done ,opts){
  		console.log(stack);
  		this.sem = 0;
	    this.mapForUri = opts && opts.cacheGlobally ? global_mapForUri : {};
	    this.done = done;
	    this.rows = [];
	    this.opts = opts;
	    this.path = opts.path;
	    debugger;
  	}
  	init(){
  		return this.transStack(stack);
  	}
  	async transStack(stack,opts){
  		this.sem = 0;
	    this.mapForUri = opts && opts.cacheGlobally ? global_mapForUri : {};
	    // this.done = done;
	    this.rows = [];
	    this.opts = opts;
	    this.path = opts.path;

  		let fields = '';
		let regex = /^ +at.+\((.*):([0-9]+):([0-9]+)/;
      	let expected_fields = 4;
      	// (skip first line containing exception message)
      	let skip_lines = 1;
	    // } else if (isFirefox() || isSafari()) {
	    //   regex = /@(.*):([0-9]+):([0-9]+)/;
	    //   expected_fields = 4;
	    //   skip_lines = 0;
	    // } else {
	    //   throw new Error("unknown browser :(");
	    // }
		console.log('stack======='+stack)
    	this.lines = stack.split("\n").slice(skip_lines);
    	console.log('lines======='+this.lines)
    	const {lines} = this;
    	for (var i=0; i < lines.length; i++) {
			const line = lines[i];
			if ( opts && opts.filter && !opts.filter(line) ) continue;

			fields = line.match(regex);
			console.log('fields: '+fields)
			if (fields && fields.length === expected_fields) {
				this.rows[i] = fields;
				debugger;
			}else{
				regex = /@(.*):([0-9]+):([0-9]+)/;
				skip_lines = 0;
				if (fields && fields.length === expected_fields) {
					this.rows[i] = fields;
					
				}
			}
	    }
	    // if (!uri.match(/<anonymous>/)) {
		// 	this.loadMap(uri);
		// }
	    return await this.processSourceMaps();
  	}
  	async processSourceMaps() {
	    const result = [];
	    let map;
	    const lines = this.lines;
	    const rows = this.rows;
	    debugger;
	    for (var i=0; i < lines.length; i++) {
	      const row = rows[i];
	      console.log('row======'+row);
	      if (row) {
	      	debugger;
	        const uri = row[1];
	        const line = parseInt(row[2], 10);
	        const column = parseInt(row[3], 10);
	        const files = uri.split("/");
	        const filename = files[files.length-1];
	        console.log('file name:'+filename);
	          // we think we have a map for that uri. call source-map library

	        const origPos = await transferByMap( line,column,filename,this.path );
	        console.log('op: '+ origPos);
	        if (origPos&&origPos.source) {
	          
	          result.push(this.formatOriginalPosition(origPos));
	        } else {
	          // we can't find a map for that url, but we parsed the row.
	          // reformat unchanged line for consistency with the sourcemapped
	          // lines.
	          result.push(row);
	        }
	      } else {
	        // we weren't able to parse the row, push back what we were given
	        result.push(lines[i]);
	      }
	    }

	    return result;
	}

	formatOriginalPosition({source, line, column, name}) {
	    // mimic chrome's format
	    return "    at " + (name ? name : "(unknown)") +
	      " (" + source + ":" + line + ":" + column + ")";
  	}
}


module.exports = {transferStack,transferByMap}