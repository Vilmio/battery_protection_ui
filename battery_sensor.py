import time
from datetime import datetime
from port_handler import PortHandler, serial_exception
from modbus import Modbus

POLLUTION_LIMIT: int = 30
TEMPERATURE_LIMIT: int = 50
HUMIDITY_LIMIT: int = 60

class BatterySensor:

    def __init__(self, config) -> None:
        self.data = Data()
        self.data.values['number_of_sensors'] = config.number_of_sensors
        self.connection_status: bool = False
        self.port_handler: PortHandler = PortHandler()
        self.modbus_client: Modbus = Modbus()
        self.write_cnt: int = 10

    @serial_exception
    def update_values(self):
        self.data.values["connection_status"] = "Connected"
        self.port_handler.run()
        if not self.port_handler.is_connected:
            self.data.values["connection_status"] = "Disconnected"
            return

        reg: int = 1003
        length: int = self.data.values["number_of_sensors"]*3
        self.data.values["sensor_values"] = {}

        if length > 40:
            read_regs = self.modbus_client.read_regs(reg, length)
            self.port_handler.serial.write(read_regs)
            data = self.port_handler.serial.read(5 + (2 * length))
            received_data = self.modbus_client.mbrtu_data_processing(data)

            read_regs = self.modbus_client.read_regs(reg, length-40)
            self.port_handler.serial.write(read_regs)
            data = self.port_handler.serial.read(5 + (2 * (length-40)))
            received_data += self.modbus_client.mbrtu_data_processing(data)
        else:
            read_regs = self.modbus_client.read_regs(reg, length)
            self.port_handler.serial.write(read_regs)
            data = self.port_handler.serial.read(5 + (2 * length))
            received_data = self.modbus_client.mbrtu_data_processing(data)

        for i in range(0, length, 3):
            pollution = (received_data[i] >> 8) & 0xFF
            pollution = pollution if pollution < 128 else pollution - 255
            sensor_id = received_data[i] & 0b00111111
            error_bit = (received_data[i] & 0b1000000) >> 6
            warning_bit = (received_data[i] & 0b10000000) >> 7
            humidity = (received_data[i + 1] >> 8) & 0xFF
            temperature = received_data[i + 1] & 0xFF
            offset_flash = (received_data[i + 2] >> 8) & 0xFF
            offset_run = received_data[i + 2] & 0xFF
            self.data.values["sensor_values"][sensor_id] = {"id": sensor_id,
                                                            "pollution": pollution,
                                                            "temperature": temperature,
                                                            "humidity": humidity,
                                                            "offset_flash": offset_flash,
                                                            "offset_run": offset_run,
                                                            "warning": warning_bit,
                                                            "error": error_bit
                                                            }

            #if pollution > 60:
            #    timestamp = datetime.timestamp(datetime.now())
            #    formatted_datetime = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')

            #    with open("log.txt", 'a') as file:
            #        file.write(f"{formatted_datetime} - {json.dumps(self.data.values['sensor_values'][sensor_id])}\n")

        if self.write_cnt >= 10:
            write_regs = self.modbus_client.write_regs(2000, [1])
            self.port_handler.serial.write(write_regs)
            self.port_handler.serial.read(5 + (2 * length))
            self.write_cnt = 0
        self.write_cnt += 1

    def get_logs_before(self) -> dict:
        reg: int = 3000
        length: int = 4
        data: dict = {}
        try:
            read_regs = self.modbus_client.read_regs(reg, length)
            self.port_handler.serial.write(read_regs)
            received_data = self.port_handler.serial.read(5 + (2 * length))
            received_data = self.modbus_client.mbrtu_data_processing(received_data)
            data["error"] = received_data[0]
            data["warning"] = received_data[1]
            data["reserve1"] = received_data[2]
            data["reserve2"] = received_data[3]

            length: int = 50
            for i in range(0, 500, length):
                read_regs = self.modbus_client.read_regs(3004+i, length)
                self.port_handler.serial.write(read_regs)
                received_data = self.port_handler.serial.read(5 + (2 * length))
                received_data = self.modbus_client.mbrtu_data_processing(received_data)

                for j in range(0, len(received_data)):
                    if (j + i) % 5 == 0:
                        data[f'hum_{(j + i) * 2}'] = received_data[j] & 0xFF
                        data[f'temp_{(j + i) * 2 + 1}'] = (received_data[j] >> 8) & 0xFF
                    else:
                        data[f'h2_{(j + i) * 2}'] = received_data[j] & 0xFF
                        data[f'h2_{(j + i) * 2 + 1}'] = (received_data[j] >> 8) & 0xFF

        except Exception as e:
            data["exception"] = f"{e}"

        return data

    def get_logs_after(self) -> dict:
        reg: int = 4000
        length: int = 4
        data: dict = {}
        try:
            read_regs = self.modbus_client.read_regs(reg, length)
            self.port_handler.serial.write(read_regs)
            received_data = self.port_handler.serial.read(5 + (2 * length))
            received_data = self.modbus_client.mbrtu_data_processing(received_data)
            data["error"] = received_data[0]
            data["warning"] = received_data[1]
            data["reserve1"] = received_data[2]
            data["reserve2"] = received_data[3]

            length: int = 50
            for i in range(0, 500, length):
                read_regs = self.modbus_client.read_regs(4004+i, length)
                self.port_handler.serial.write(read_regs)
                received_data = self.port_handler.serial.read(5 + (2 * length))
                received_data = self.modbus_client.mbrtu_data_processing(received_data)

                for j in range(0, len(received_data)):
                    if (j + i) % 5 == 0:
                        data[f'hum_{(j + i) * 2}'] = received_data[j] & 0xFF
                        data[f'temp_{(j + i) * 2 + 1}'] = (received_data[j] >> 8) & 0xFF
                    else:
                        data[f'h2_{(j + i) * 2}'] = received_data[j] & 0xFF
                        data[f'h2_{(j + i) * 2 + 1}'] = (received_data[j] >> 8) & 0xFF

        except Exception as e:
            data["exception"] = f"{e}"

        return data

    def get_test_data(self) -> dict:
        self.update_values()
        data = dict()
        if len(self.data.values["sensor_values"]) == 0:
            data["exception"] = "opening serial port: list index out of range"
            return data
        for i in self.data.values["sensor_values"]:
            data[self.data.values["sensor_values"][i]['id']] = True
            if self.data.values["sensor_values"][i]['pollution'] > POLLUTION_LIMIT:
                data[self.data.values["sensor_values"][i]['id']] = False
            if self.data.values["sensor_values"][i]['temperature'] > TEMPERATURE_LIMIT:
                data[self.data.values["sensor_values"][i]['id']] = False
            if self.data.values["sensor_values"][i]['humidity'] > HUMIDITY_LIMIT:
                data[self.data.values["sensor_values"][i]['id']] = False
            if self.data.values["sensor_values"][i]['warning'] > 0:
                data[self.data.values["sensor_values"][i]['id']] = False
            if self.data.values["sensor_values"][i]['error'] > 0:
                data[self.data.values["sensor_values"][i]['id']] = False

        return data

    def get_info_data(self) -> dict :
        reg: int = 100
        length: int = 4
        data: dict = {}
        try:
            read_regs = self.modbus_client.read_regs(reg, length)
            self.port_handler.serial.write(read_regs)
            received_data = self.port_handler.serial.read(5 + (2 * length))
            received_data = self.modbus_client.mbrtu_data_processing(received_data)
            print(received_data)
            data['hwVersion'] = received_data[0]
            data['fwVersion'] = received_data[1]
            data['bootCount'] = received_data[2]
            data['runTime'] = received_data[3]
        except Exception as e:
            data["exception"] = f"{e}"
        return data


class Data:
    def __init__(self) -> None:
        self.values: dict = dict()
        self.values["sensor_values"] = {}
        self.values["connection_status"] = "Disconnected"
        self.values["number_of_sensors"] = 3

