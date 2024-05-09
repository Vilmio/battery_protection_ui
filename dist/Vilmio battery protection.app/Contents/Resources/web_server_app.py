import json
from flask import Flask, jsonify, render_template, request
from battery_sensor import BatterySensor
import os
from flask_cors import CORS
import webview


STATIC_PATH = 'frontend/dist/frontend/browser/'
STATIC_URL_PATH = '/frontend/dist/frontend/browser/'
TEMPLATE_PATH = 'frontend/dist/frontend/browser/'

app = Flask("Battery protection", template_folder=TEMPLATE_PATH, static_url_path=STATIC_URL_PATH,
            static_folder=STATIC_PATH)
CORS(app)

battery_sensor = BatterySensor()
window = webview.create_window('Vilmio sensors', 'http://127.0.0.1:8000', confirm_close=False)

@app.route('/')
def main():
    return render_template('index.html')


@app.route('/<path:path>')
def static_proxy(path):
    return app.send_static_file(path)


@app.route('/data_table')
def overview():
    return render_template('data_table.html')


@app.route('/getPorts')
def get_port():
    response = app.response_class(
        response=json.dumps(battery_sensor.port_handler.get_usb_uart()),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/updateData')
def update_data():
    battery_sensor.update_values()
    response = app.response_class(
        response=json.dumps(battery_sensor.data.values),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route("/setPort", methods=['POST', 'GET'])
def set_port():
    if request.method == 'POST':
        battery_sensor.port_handler.reinit_serial(port=request.json["port"])

    response = app.response_class(
        status=200,
        mimetype='application/json'
    )
    return response

@app.route("/setNumberOfSensors", methods=['POST', 'GET'])
def set_number_of_sensors():
    if request.method == 'POST':
        print(f"Number of sensors: {request.json['number_of_sensors']}")
        battery_sensor.data.values["number_of_sensors"] = int(request.json['number_of_sensors'])

    response = app.response_class(
        status=200,
        mimetype='application/json'
    )
    return response

@app.route("/readMemory", methods=['POST', 'GET'])
def read_memory():
    datalayer = battery_sensor.get_memory_data()
    print(datalayer, type(datalayer["error"]) is str)
    response = app.response_class(
        response=json.dumps(datalayer),
        status=200,
        mimetype='application/json'
    )
    return response


def get_version():
    arr = os.listdir()
    for i in arr:
        if i.startswith("rev"):
            version = i[3:]
            version = version.split("_")
            return version[1]
    return "0.0.0"


def start_flask():
    app.run(host="127.0.0.1", port=8000)


def on_closed():
    print('App is closed')
    os._exit(0)


def on_closing():
    print('pywebview window is closing')
    window.destroy()


window.events.closed += on_closed
window.events.closing += on_closing
webview.start(start_flask, ssl=True)

#start_flask()