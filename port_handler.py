from serial import Serial
import serial.tools.list_ports
from typing import Optional


class PortHandler:
    serial: Optional[Serial] = None
    baudrate: int = 9600
    __is_connected: bool = False

    def __init__(self):
        self.client_port = None

    @classmethod
    def get_usb_uart(cls) -> list:
        ports = serial.tools.list_ports.comports()
        uart_ports = [port for port in ports if 'USB' in port.description or 'UART' in port.description]
        if not uart_ports:
            return []

        if len(uart_ports) == 1:
            return [uart_ports[0].device]
        else:
            ports: list = []
            for port in uart_ports:
                ports.append(port.device)

            if hasattr(cls.serial, 'name') and cls.serial.name in ports:
                ports.remove(cls.serial.name)
                ports.insert(0, cls.serial.name)
            return ports

    @classmethod
    def run(cls):
<<<<<<< HEAD
        if cls.serial is None or (hasattr(cls.serial, 'is_open') and not PortHandler.__is_connected):
            cls.init_serial()

    @classmethod
    def reinit_serial(cls, port):
        print(f"Reinit serial port: {port}")
=======
        if serial is None or (hasattr(cls.serial, 'is_open') and not cls.serial.is_open):
            cls.init_serial()

        print(f"serial is open: {cls.serial.is_open}")

        print(cls.serial.name)

    @classmethod
    def reinit_serial(cls, port):
        print(f"reinit serial port: {port}")
>>>>>>> 1662c18a844211f37b81936701e1dfa7b2b61af7
        try:
            cls.serial = Serial(port, cls.baudrate, timeout=1)
            cls.serial.close()
            cls.serial.open()
            cls.__is_connected = True
        except Exception as e:
            print(f"Error opening serial port: {e}")
            cls.__is_connected = False

    @classmethod
    def init_serial(cls):
        try:
            port: str = cls.get_usb_uart()[0]
<<<<<<< HEAD
            cls.serial = Serial(port, cls.baudrate, timeout=0.1)
=======
            cls.serial = Serial(port, cls.baudrate, timeout=1)
>>>>>>> 1662c18a844211f37b81936701e1dfa7b2b61af7
            cls.serial.close()
            cls.serial.open()
            cls.__is_connected = True
        except Exception as e:
<<<<<<< HEAD
            print(f"Error opening serial port: {e}")
=======
            print(f"Error openning serial port: {e}")
>>>>>>> 1662c18a844211f37b81936701e1dfa7b2b61af7
            cls.__is_connected = False

    @property
    def is_connected(self):
        return PortHandler.__is_connected


def serial_exception(f):
    def wrapper(*args, **kwargs):
        try:
            f(*args, **kwargs)
        except serial.SerialException as e:
            print(f" === Serial port error: {e}")
            PortHandler().init_serial()

        except OSError as e:
            if e.errno == 6:
<<<<<<< HEAD
                print(f" === Device was unplugged! {e}")
            else:
                print(f" === OSError: {e}")
                PortHandler().init_serial()
        except Exception as e:
            print(f" === Device is not connected! {e}")

    return wrapper
=======
                print(" === Device was unplugged!")
            else:
                print(f" === OSError: {e}")
        except Exception as e:
            print(" === Device is not connected!")
    return wrapper
>>>>>>> 1662c18a844211f37b81936701e1dfa7b2b61af7
