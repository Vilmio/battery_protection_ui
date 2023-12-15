var version = "0.0"

const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

function updateData() {
    $.ajax({ url: "/updateData" }).done(function (data) {
        $("#connection_status").text(" "+data.connection_status)
        $("#port").text(data.port)

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
                    $("#"+key+"_"+sensor_id).text(sensor_values[key])

                }
            }
        }
        dotControl()
    })
}

function dotControl() {
    elements = $("#dot");
    for (var t = 0; t < elements.length; t++) "white" == elements[t].style.color ? (elements[t].style.color = "#ff5c20ff") : (elements[t].style.color = "white");
}

$(function () {
    $("div.mainContainer").load("data_table", function () {
        createTable()
        $(".loader").hide(100);
        setInterval(function () {
            $.ajax({ url: "/updateData" }).done(function (t) {
                $("#state").css("color","#ff5c20ff")
                $("#state").text("Reading ...")
                updateData(t)
            });
        }, 2e3);
    })
});

function createTable(){
    for(let i = 0; i < 25; i++) {
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