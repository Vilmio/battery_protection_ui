import json
from flask import Flask, jsonify, render_template, request
from battery_sensor import BatterySensor
import os

STATIC_PATH = 'main'
STATIC_URL_PATH = '/main'
TEMPLATE_PATH = 'main/template/'

app = Flask(__name__, template_folder=TEMPLATE_PATH, static_url_path=STATIC_URL_PATH, static_folder=STATIC_PATH)

battery_sensor = BatterySensor()


@app.route('/')
def main():
    return render_template('main.html')


@app.route('/data_table')
def overview():
    return render_template('data_table.html')


@app.route('/updateData')
def update_data():
    battery_sensor.update_data()
    response = app.response_class(
        response=json.dumps(battery_sensor.data.values),
        status=200,
        mimetype='application/json'
    )
    return response


@app.route('/test', methods=['POST', 'GET'])
def test():
    for i in request.form:
        data = json.loads(i)
        if data["cmd"] == "get_firmware_version":
            datalayer = {'Status': battery_sensor.firmware_version, 'Tester': get_version()}

    response = app.response_class(
        response=json.dumps(datalayer),
        status=200,
        mimetype='application/json'
    )
    return response


def get_version():
    arr = os.listdir()
    for i in arr:
        if i[:3] == "rev":
            version = i[3:]
            version = version.split("_")
            return version[1]
    return "0.0.0"


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)
