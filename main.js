//query errors
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
        console.log(xmlhttp);
        var data = JSON.parse(xmlhttp.response);
        var html = ''
        for(var i=0;i < data.errors.length;i++){
            var _d = data.errors[i];
            html += '<tr><td>'+_d.host+'</td><td>' +_d.url+'</td><td>' +
            _d.time + '</td><td>' + _d.line + '</td><td>'+
            _d.col + '</td><td>' + JSON.stringify(_d.stack) + '</td><td>'
            + _d.browser + '</td></tr>';
        }
        document.getElementById('errorTbody').innerHTML = html;
    }
}
xmlhttp.open("GET","/api/query",true);
xmlhttp.send();

$.ajax({
    url:'/api/test'
})

//throw error
// throw new Error('error test!!!');