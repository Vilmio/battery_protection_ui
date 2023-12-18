import time
from datetime import datetime
from serial import Serial
from modbus import Modbus
import json
import sys
import glob
import serial.tools.list_ports


class BatterySensor:

    def __init__(self) -> None:
        print("INIT SERIAL PORT ...")
        self.data = Data()
        self.baudrate = 9600
        self.connection_status: bool = False
        self.com = "None"
        self.serial: Serial = None
        self.modbus_client: Modbus = Modbus()
        self.write_cnt: int = 10

    def reinit_serial(self, port):
        try:
            self.data.values["port"] = port
            self.serial = Serial(port, self.baudrate, timeout=1)
            self.serial.close()
            self.serial.open()
            self.connection_status = True
        except Exception as e:
            self.connection_status = False
    def init_serial(self):
        self.com = self.get_usb_uart()[0]
        print(self.com)
        if self.com is not None:
            try:
                self.data.values["port"] = self.com
                self.serial = Serial(self.com, self.baudrate, timeout=1)
                self.serial.close()
                self.serial.open()
                self.connection_status = True
            except Exception as e:
                self.connection_status = False

    def get_usb_uart(self):
        ports = serial.tools.list_ports.comports()
        uart_ports = [port for port in ports if 'USB' in port.description or 'UART' in port.description]
        if not uart_ports:
            return None

        if len(uart_ports) == 1:
            return [uart_ports[0].device]
        else:
            ports: list = []
            for port in uart_ports:
                ports.append(port.device)

            return ports

    def update_values(self):
        self.data.values["connection_status"] = "disconnected"
        if not self.connection_status:
            try:
                self.init_serial()
            except Exception as e:
                print(f"Connection exception: {e}")
            return

        else:
            self.data.values["connection_status"] = "connected"
        reg: int = 1002
        length: int = 50
        try:
            read_regs = self.modbus_client.read_regs(reg, length)
            self.serial.write(read_regs)
            received_data = self.serial.read(5 + (2 * length))
            received_data = self.modbus_client.mbrtu_data_processing(received_data)
            for i in range(0, length, 2):
                h2 = (received_data[i] >> 8) & 0xFF
                h2 = h2 if h2 < 128 else h2 - 255
                sensor_id = received_data[i] & 0b00111111
                error_bit = received_data[i] & 0b1000000
                warning_bit = received_data[i] & 0b10000000
                humidity = (received_data[i + 1] >> 8) & 0xFF
                temperature = received_data[i + 1] & 0xFF
                self.data.values["sensor_values"][sensor_id] = {"id": sensor_id,
                                                                "h2": h2,
                                                                "temp": temperature,
                                                                "hum": humidity,
                                                                "error": error_bit,
                                                                "warning": warning_bit}
                if h2 > 60:
                    timestamp = datetime.timestamp(datetime.now())
                    formatted_datetime = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')

                    with open("log.txt", 'a') as file:
                        file.write(f"{formatted_datetime} - {json.dumps(self.data.values['sensor_values'][sensor_id])}\n")
        except Exception as e:
            print(f"Exception: {e}")

        if self.write_cnt >= 10:
            write_regs = self.modbus_client.write_regs(2000, [1])
            self.serial.write(write_regs)
            received_data = self.serial.read(5 + (2 * length))
            self.write_cnt = 0
        self.write_cnt += 1
        time.sleep(0.5)

    def get_memory_data(self):
        print("Read memory!")
        reg: int = 3000
        length: int = 50
        data: dict = {}
        try:
            read_regs = self.modbus_client.read_regs(reg, length)
            self.serial.write(read_regs)
            received_data = self.serial.read(5 + (2 * length))
            received_data = self.modbus_client.mbrtu_data_processing(received_data)
            data["error"] = received_data[0]
            data["warning"] = received_data[1]
            for i in range(2, len(received_data)):
                h2 = received_data[i]
                data[i] = h2

        except Exception as e:
            print(f"Exception: {e}")
            data["error"] = f"{e}"

        return data

class Data:
    def __init__(self) -> None:
        self.values: dict = dict()
        self.values["sensor_values"] = {}
