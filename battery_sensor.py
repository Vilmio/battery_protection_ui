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

    def init_serial(self):
        self.com = self.serial_ports()
        if self.com is not None:
            self.data.values["port"] = self.com
            self.serial = Serial(self.com, self.baudrate, timeout=1)
            self.serial.close()
            self.serial.open()
            self.check_presence()

    def serial_ports(self):
        ports: list = []
        if sys.platform.startswith('win'):
            port = ['COM%s' % (i + 1) for i in range(256)]
        elif sys.platform.startswith('linux') or sys.platform.startswith('cygwin'):
            port = glob.glob('/dev/tty[A-Za-z]*')
            for p in port:
                if "USB" in p:
                    ports.append(p)
        elif sys.platform.startswith('darwin'):
            port = glob.glob('/dev/tty.*')
            for p in port:
                if "usbserial" in p:
                    ports.append(p)
        else:
            raise EnvironmentError('Unsupported platform')

        result = []
        for port in ports:
            try:
                s = serial.Serial(port)
                s.close()
                result.append(port)
            except (OSError, serial.SerialException):
                pass

        if result:
            return result[0]
        return None

    def check_presence(self):
        if sys.platform.startswith('win'):
            myports = ['COM%s' % (i + 1) for i in range(256)]
        elif sys.platform.startswith('linux') or sys.platform.startswith('cygwin'):
            myports = glob.glob('/dev/tty[A-Za-z]*')
        elif sys.platform.startswith('darwin'):
            myports = glob.glob('/dev/tty.*')
        else:
            self.connection_status = False
            return
        if self.com in myports:
            self.connection_status = True
        else:
            self.connection_status = False

    def update_data(self):
        self.check_presence()
        self.data.values["connection_status"] = "disconnected"
        if not self.connection_status:
            try:
                self.init_serial()
            except Exception as e:
                print(f"Connection exception: {e}")
            return

        else:
            self.data.values["connection_status"] = "connected"
        reg: int = 1000
        length: int = 6
        try:
            read_regs = self.modbus_client.read_regs(reg, length)
            self.serial.write(read_regs)
            received_data = self.serial.read(5 + (2 * length))
            received_data = self.modbus_client.mbrtu_data_processing(received_data)
            print(received_data)
            for i in range(0, length, 2):
                h2 = (received_data[i] >> 8) & 0xFF
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
                if h2 > 20:
                    timestamp = datetime.timestamp(datetime.now())
                    formatted_datetime = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')

                    with open("log.txt", 'a') as file:
                        file.write(f"{formatted_datetime} - {json.dumps(self.data.values['sensor_values'][sensor_id])}\n")
        except Exception as e:
            print(f"Exception: {e}")

        if self.write_cnt >= 10:
            print("Zapisuji data")
            write_regs = self.modbus_client.write_regs(2000, [1])
            self.serial.write(write_regs)
            received_data = self.serial.read(5 + (2 * length))
            self.write_cnt = 0
        self.write_cnt += 1

class Data:
    def __init__(self) -> None:
        self.values: dict = dict()
        self.values["sensor_values"] = {}
