import time
from datetime import datetime
from port_handler import PortHandler, serial_exception
from modbus import Modbus
import json


class BatterySensor:

    def __init__(self) -> None:
        self.data = Data()
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

        reg: int = 1002
        length: int = self.data.values["number_of_sensors"]*2

        read_regs = self.modbus_client.read_regs(reg, length)
        self.port_handler.serial.write(read_regs)
        self.data.values["send_packets"] += 1
        received_data = self.port_handler.serial.read(5 + (2 * length))
        received_data = self.modbus_client.mbrtu_data_processing(received_data)
        self.data.values["receive_packets"] += 1
        self.data.values["sensor_values"] = {}
        for i in range(0, length, 2):
            pollution = (received_data[i] >> 8) & 0xFF
            pollution = pollution if pollution < 128 else pollution - 255
            sensor_id = received_data[i] & 0b00111111
            error_bit = (received_data[i] & 0b1000000) >> 6
            warning_bit = (received_data[i] & 0b10000000) >> 7
            humidity = (received_data[i + 1] >> 8) & 0xFF
            temperature = received_data[i + 1] & 0xFF
            self.data.values["sensor_values"][sensor_id] = {"id": sensor_id,
                                                            "pollution": pollution,
                                                            "temperature": temperature,
                                                            "humidity": humidity,
                                                            "offset_flash": 0,
                                                            "offset_run": 0,
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

    def get_memory_data(self):
        print("Read memory!")
        reg: int = 3000
        length: int = 50
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
            for i in range(4, len(received_data)):
                h2 = received_data[i]
                data[i] = h2

            #3004 0 - teplota
            #1 - vlhkost
            #2-9 - vodik


        except Exception as e:
            #print(f"Exception: {e}")
            data["error"] = f"{e}"

        return data


class Data:
    def __init__(self) -> None:
        self.values: dict = dict()
        self.values["sensor_values"] = {}
        self.values["connection_status"] = "Disconnected"
        self.values["send_packets"] = 0
        self.values["receive_packets"] = 0
        self.values["number_of_sensors"] = 3

