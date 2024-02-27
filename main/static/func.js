const data = {
    labels: [],
    datasets: []
};


const config = {
    type: 'line',
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

function setDataSet(numOfSensors){
    for (let i = 1; i <= numOfSensors; i++) {
        data.datasets.push({
            label: 'H2_' + i,
            data: [],
            borderColor: generateRandomHexColor(),//'#ff5c20ff',
            fill: true
        });
    }
}

function addData(chart, label, data) {
            chart.data.labels.push(label);
            for (let i = 0; i < chart.data.datasets.length; i++) {
                chart.data.datasets[i].data.push(data[i]);
                if(data[i] < 1) {
                    //chart.data.datasets.labels[i] = null
                }
            }
            chart.update();
        }


function updateData(data) {
        $("#connection_status").text(" " + data.connection_status)
        $("#port").text(data.port)

        const newData = []
        for (let sensor_id in data.sensor_values) {
            if (data.sensor_values.hasOwnProperty(sensor_id)) {
                let sensor_values = data.sensor_values[sensor_id];
                for (let key in sensor_values) {
                    if(key === "error" && sensor_values[key] === 1){
                        $("#id"+sensor_id).css("background-color","#ff5c20ff")
                        continue
                    }else if(key === "warning" && sensor_values[key] === 1){
                        if(sensor_values["error"] !== 1) {
                            $("#id" + sensor_id).css("background-color", "#ffff00")
                        }
                        continue
                    }else if((key === "error" || key === "warning") && sensor_values["error"] !== 1 && sensor_values["warning"] !== 1){
                        $("#id" + sensor_id).css("background-color", "#ffffff")
                    }
                    let val = sensor_values[key]
                    if(sensor_values[key] === 255){
                        val = "-,-";
                    }
                    $("#"+key+"_"+sensor_id).text(val)
                }
                newData.push((parseInt(data.sensor_values[sensor_id]['h2'],10) > 2) ? data.sensor_values[sensor_id]['h2'] : null);
            }
        }
        const now = new Date();
        const newLabel = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

        addData(myChart, newLabel, newData);
        dotControl()
}

function dotControl() {
    let elements = $("#dot");
    for (let t = 0; t < elements.length; t++) "white" === elements[t].style.color ? (elements[t].style.color = "#ff5c20ff") : (elements[t].style.color = "white");
}

$(function () {
    $("div.mainContainer").load("data_table", function () {
        myChart = new Chart(document.getElementById('myChart').getContext('2d'), config);
        let numOfSensors = parseInt(localStorage.getItem('num_of_sensors'));
        if(isNaN(numOfSensors)){
            localStorage.setItem('num_of_sensors','24')
            numOfSensors = 24
        }
        setDataSet(numOfSensors)
        createTable(numOfSensors)
        document.getElementById('input-number').value = numOfSensors
        $(".loader").hide(100);
        getUsbPorts()
        setInterval(function () {
            $.ajax({ url: "/updateData" }).done(function (t) {
                updateData(t)
                getUsbPorts()
            });
        }, 2e3);
    })
});

$(document).ready(function() {
    $('#port_select').change(function() {
        let selectedValue = $(this).val();
        $.ajax({
            type: "POST",
            url: "/setPort",
            async: !0,
            contentType: "application/json",
            data: JSON.stringify({port: selectedValue}),
        });
    });
});

function getUsbPorts(){
    $.ajax({ url: "/getPorts" }).done(function (t) {
        let select = $('#port_select');
        select.empty()
        $.each(t, function(key, value) {
            select.append($('<option></option>').val(value).html(value));
        });
    });
}

function createTable(numOfSensors){
    for(let i = 1; i <= numOfSensors; i++) {
        $('<tr id="id'+i+'" style="height: 2px;">' +
                '<td style="height: 2px;"><span id="id_'+i+'">-,-</span></td>' +
                '<td><span id="h2_'+i+'">-,- </span></td>' +
                '<td><span id="temp_'+i+'">-,- </span></td>' +
                '<td><span id="hum_'+i+'">-,- </span></td>' +
            '</tr>').appendTo("#table_body")
    }
}
$(document).on("click", "#refresh", function () {
    location.reload();
})
function openNav() {
    $("#mySidenav").css("width", "250px");
}
function closeNav() {
    $("#mySidenav").css("width", "0");
}
function refreshPage() {
    window.location.reload();
}
function readMemory(){
    $('#memoryData').text("")
    $.ajax({
        type: "POST",
        url: "/readMemory",
        async: !0,
        success: function (s) {
            create_log_table()
            for(let i in s) {
                add_data_to_log_table(i, s[i])
            }
        },
        error: function (s){
            $('#memoryData').text("Reading error!!")
        }
    })
}

document.getElementById('button-plus').addEventListener('click', function() {
    if(document.getElementById('input-number').value <= 49) {
        document.getElementById('input-number').value = parseInt(document.getElementById('input-number').value) + 1;
        localStorage.setItem('num_of_sensors', document.getElementById('input-number').value.toString());
    }
});

document.getElementById('button-minus').addEventListener('click', function() {
    if(document.getElementById('input-number').value > 1) {
        document.getElementById('input-number').value = parseInt(document.getElementById('input-number').value) - 1;
        localStorage.setItem('num_of_sensors', document.getElementById('input-number').value.toString());
    }
});
function generateRandomHexColor() {
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 16).toString(16);
    }
    return color;
}
function create_log_table(){
     $('<table className="table text-center" aria-describedby="Data table">'+
         '<tbody id="log_table">'+
         '</tbody>'+
     '</table>').appendTo("#memoryData")
}
function add_data_to_log_table(key, data){
    $('<tr style="height: 2px;">' +
        '<td style="color: #ff5c20ff; height: 2px;"><span>'+key+'</span></td>' +
        '<td><span> '+data+' </span></td>' +
        '<td><span> '+data+' </span></td>' +
    '</tr>').appendTo("#log_table")
}