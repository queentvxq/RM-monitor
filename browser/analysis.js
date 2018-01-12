//analysis errors

var renderTable = function(data){
    var html = '';
    for(var i=0;i < data.length;i++){
        var _d = data[i];
        var list = _d.list;
        var l = _d.size;
        html += '<tr><td rowspan="'+l+'">'+(i+1)+'</td><td rowspan="'+l+'">'+_d._id+'</td><td rowspan="'+l+'">'
        + _d.size + '</td><td>'
        + (list[0].url||"Script error.") +'</td><td>' + list[0].info.length + '</td></tr>';
        if(l > 1){
            for(var j = 1;j < l;j++){
                html += '<tr><td>'+ (list[j].url||"Script error.") + '</td><td>' + list[j].info.length+'</td></tr>'
            }
        }
    }
    document.getElementById('hostTbody').innerHTML = html;
}

var renderTableByError = function(data){
    var html = '';
    var l = data.length;
    for(var i=0;i < data.length;i++){
        var _d = data[i];
        html += '<tr><td>'+(i+1)+'</td><td>'+_d._id.page+'</td><td>'
        + _d._id.info + '</td><td>'
        + _d.size + '</td></tr>';
    }
    document.getElementById('errorTbody').innerHTML = html;
}

var $st = $('#startTime');
var $et = $('#endTime');

var search = function(){
    $.ajax({
        url:'/api/analysis/byHost?startTime='+$st.val()+'&endTime='+$et.val(),
        type:'get',
        success:(rsp)=>{
            var data = JSON.parse(rsp)
            renderTable(data);
        }
    })
    $.ajax({
        url:'/api/analysis/byError?startTime='+$st.val()+'&endTime='+$et.val(),
        type:'get',
        success:(rsp)=>{
            var data = JSON.parse(rsp)
            renderTableByError(data);
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