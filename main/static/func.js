const data = {
    labels: [],
    datasets: [
        { label: 'H2_1', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_2', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_3', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_4', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_5', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_6', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_7', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_8', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_9', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_10', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_11', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_12', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_13', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_14', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_15', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_16', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_17', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_18', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_19', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_20', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_21', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_22', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_23', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_24', data: [], borderColor: '#ff5c20ff', fill: false },
        { label: 'H2_5', data: [], borderColor: '#ff5c20ff', fill: false },

    ]
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
                    }
                    if(key === "warning" && sensor_values[key] === 1){
                        $("#id"+sensor_id).css("background-color","red")
                        continue
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
        createTable()
        $(".loader").hide(100);
        getUsbPorts()
        setInterval(function () {
            $.ajax({ url: "/updateData" }).done(function (t) {
                updateData(t)
            });
        }, 2e3);
    })
});

$(document).ready(function() {
    $('#port_select').change(function() {
        let selectedValue = $(this).val();
        console.log('Vybraná hodnota:', JSON.stringify({port: selectedValue}));
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

function createTable(){
    for(let i = 1; i < 26; i++) {
        $('<tr id="id'+i+'">' +
                '<td><span id="id_'+i+'">-,-</span></td>' +
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
            for(let i in s) {
                $('#memoryData').append(i+"="+s[i]+"<br>")
            }

        },
        error: function (s){
            $('#memoryData').text("Reading error!!")
        }
    })
}