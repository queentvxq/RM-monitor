//query errors
var xmlhttp;
if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
}else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
var renderTable = function(data){
    var html = ''
        for(var i=0;i < data.errors.length;i++){
            var _d = data.errors[i];
            var stack = (typeof _d.stack === 'string')?_d.stack:JSON.stringify(_d.stack);
            html += '<tr><td>'+(i+1)+'</td><td>'+_d.page+'</td><td>' +_d.url+'</td><td>' +
            _d.localtime + '</td><td>' + _d.line + '</td><td>'+
            _d.column + '</td><td><p>' + stack + '</p></td><td>' + _d.info + '</td><td>'
            + _d.browser + '</td></tr>';
        }
    document.getElementById('errorTbody').innerHTML = html;
}
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        console.log(xmlhttp);
        var data = JSON.parse(xmlhttp.response);
        renderTable(data);
    }
}
xmlhttp.open("GET","/api/query?startTime=",true);
xmlhttp.send();

var $st = $('#startTime');
var $et = $('#endTime');
var $page = $('#URL');
var search = function(){
    $.ajax({
        url:'/api/query?startTime='+$st.val()+'&endTime='+$et.val()+'&page='+$page.val(),
        type:'get',
        success:(rsp)=>{
            var data = JSON.parse(rsp)
            renderTable(data);
        }
    })
}

$('#seachBtn').on('click',()=>{
    search();
})

$('.date').datetimepicker({
    minView: 2,
    maxView: 2,
    autoclose: true,
    format:"yyyy/mm/dd"
});

// throw new Error();