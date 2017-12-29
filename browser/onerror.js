/**
 * @param {String}  e   错误信息
 * @param {String}  url      出错的文件
 * @param {Long}    line     出错代码的行号
 * @param {Long}    col   出错代码的列号
 * @param {Object}  error       错误的详细信息，可能包含堆栈
 */
var host = {
    test: 'http://172.16.101.38:3000',
    dev:  'http://localhost:3000'
}
var URL = host.test + "/api/insertError";

var DEFAULT_DATA = {
    page: window.location.href,
    screen: window.screen.width+' x '+window.screen.height,
    browser: navigator.appVersion,
}
try{
    window.onerror = function(e, url, line, col, error) {

            //URL
            if (e != "Script error." && !url) {
                return false;
            }
            setTimeout(() => {

                var data = {
                	info: e || error.message,
                	url: url,
                	line: line,
                    page: window.location.href,
                	col: col || (window.event && window.event.errorCharacter) || 0,
                	time: new Date().getTime(),
                    browser: navigator.appVersion,
                    screen: window.screen.width+' x '+window.screen.height
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

                console.log('========= before send msg');
                sendRequest(data);
               console.log('======= after send msg');

            }, 0);
            return false;
    	
    }
}catch (e){
    console.log('===== onerror ======');
    console.log(e);
}

var errorFromCDN = function(url) {
    var data = {
        info: 'cdn load error',
        url: url,
        line: 0,
        col: 0,
        time: new Date().getTime(),
        browser: navigator.appVersion,
        screen: window.screen.width+' x '+window.screen.height,
        stack:'cdn load error',
        page: window.location.href
    };
    // var xmlhttp;
    // if (window.XMLHttpRequest) {
    //     // code for IE7+, Firefox, Chrome, Opera, Safari
    //     xmlhttp = new XMLHttpRequest();
    // }else {
    //     // code for IE6, IE5
    //     xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    // }
    // xmlhttp.onreadystatechange = function() {
    //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //         console.log('error reported');
    //     }
    // }
    // xmlhttp.open("POST","",true);
    // xmlhttp.setRequestHeader("Content-type","application/json");
    // xmlhttp.send(JSON.stringify(data));

    sendRequest(data);
}

//jsonp cross-domain
const sendRequest = function(data){
  var ts = new Date().getTime().toString();
  var fakeImg = new Image(0, 0);
  fakeImg.src = URL + '?data=' + encodeURIComponent(JSON.stringify(data)) + '&_=' + ts;
  fakeImg.onload = function() {
    console.log('error reported');
  }
  document.body.appendChild(fakeImg);
}

// var getStackTrace = function () {
//     var stack = [];
//     var f = arguments.callee.caller;
//     while (f) {
//         stack.push(getFunctionName(f));
//         f = f.caller;
//     }
//     return stack;
// }

// var sendHttpError = function(data) {
//     $.ajax({
//         url: '/api/insertError',
//         type: 'POST',
//         data: JSON.stringify(data),
//         contentType: 'application/json',
//         success: function(){
//             console.log('http error report success');
//         }
//     })
// }

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