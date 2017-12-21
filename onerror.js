/**
 * @param {String}  e   错误信息
 * @param {String}  url      出错的文件
 * @param {Long}    line     出错代码的行号
 * @param {Long}    col   出错代码的列号
 * @param {Object}  error       错误的详细信息，可能包含堆栈
 */

window.onerror = function(e, url, line, col, error) {

        //URL
        if (e != "Script error." && !url) {
            return false;
        }
        setTimeout(() => {

            const data = {
            	info: e || error.message,
            	url: url,
            	line: line,
            	col: col || (window.event && window.event.errorCharacter) || 0,
            	time: new Date(),
                browser: navigator.appVersion
            };
            

            if (!!error && !!error.stack) {
                //use stack directly
                data.stack = error.stack.toString();
            } else if (!!arguments.callee) {
                //get stack by callee
                var ext = [];
                var f = arguments.callee.caller, c = 3;
                //这里只拿三层堆栈信息
                while (f && (--c > 0)) {
                    ext.push(f.toString());
                    if (f === f.caller) {
                        break;//如果有环
                    }
                    f = f.caller;
                }
                ext = ext.join(",");
                data.stack = ext;
            }else {
            	if(!error.stack) {
					data.stack += '\n\tat '+ fnName + ' (http://.../)' + url + ':'
						+ line + ':' + col + ')'
				}
            }
            //把data上报到后台！
            //这里可以做日志上报
            console.log('========= before send msg');
            console.log(data);
            //send request
            var xmlhttp;
			if (window.XMLHttpRequest) {
				// code for IE7+, Firefox, Chrome, Opera, Safari
				xmlhttp = new XMLHttpRequest();
			}else {
				// code for IE6, IE5
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					console.log('error report success');
				}
			}
			xmlhttp.open("POST","/api/insertError",true);
			xmlhttp.setRequestHeader("Content-type","application/json");
			xmlhttp.send(JSON.stringify(data));

           console.log('======= after send msg');
           
        }, 0);
        return false;
	
}

var getStackTrace = function () {
    var stack = [];
    var f = arguments.callee.caller;
    while (f) {
        stack.push(getFunctionName(f));
        f = f.caller;
    }
    return stack;
}

var sendHttpError = function(data) {
    $.ajax({
        url: '/api/insertError',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(){
            console.log('http error report success');
        }
    })
}

// $.ajaxSetup({
//     error: function(jqXHR){
//         console.log(jqXHR);
//         var data = {
//             url: this.url,
//             info: jqXHR.status
//         }
//         sendHttpError(data)
//     }
// })