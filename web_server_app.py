import json
from threading import Thread
from flask import Flask, jsonify, render_template, request
from battery_sensor import BatterySensor
import os
from flask_cors import CORS
import webview
from config_db import Config
import signal
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_PATH = os.path.join(BASE_DIR, 'frontend/dist/frontend/browser/')
TEMPLATE_PATH = os.path.join(BASE_DIR, 'frontend/dist/frontend/browser/')

app = Flask("Battery protection", template_folder=TEMPLATE_PATH, static_folder=STATIC_PATH)
CORS(app)

screen = webview.screens[0]
max_height = screen.height * 0.9
max_width = screen.width * 0.65
config = Config()
battery_sensor = BatterySensor(config=config)
window = webview.create_window('Vilmio sensors',
                               'http://127.0.0.1:8000',
                               confirm_close=False,
                               height=max_height,
                               width=max_width)


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
        config.db.set_new_value(int(request.json['number_of_sensors']))
        battery_sensor.data.values["number_of_sensors"] = int(request.json['number_of_sensors'])

    response = app.response_class(
        status=200,
        mimetype='application/json'
    )
    return response


@app.route("/getLogs", methods=['POST', 'GET'])
def get_logs():
    datalayer = battery_sensor.get_logs_before()
    response = app.response_class(
        response=json.dumps(datalayer),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route("/getLogsAfter", methods=['POST', 'GET'])
def get_logs_after():
    datalayer = battery_sensor.get_logs_after()
    response = app.response_class(
        response=json.dumps(datalayer),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route("/getTest", methods=['POST', 'GET'])
def get_test():
    datalayer = battery_sensor.get_test_data()
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
    os.kill(os.getpid(), signal.SIGTERM)
    window.destroy()

def on_loaded():
    window.move(max_width / 2.5, 0)  # x = 0 (levý okraj), y = 0 (horní okraj)

#start_flask()
if __name__ == '__main__':
    flask_thread = Thread(target=start_flask)
    flask_thread.daemon = True
    flask_thread.start()

    window.events.closed += on_closed
    window.events.closing += on_closing
    window.events.loaded += on_loaded
    webview.start()
