import serial
import glob
import sys


class PortHandler:

    def __init__(self):
        self.connected = False
        self.client_port = None

    def get_ports(self):
        print(f"Platform : {sys.platform}")
        if sys.platform.startswith('win'):
            ports = ['COM%s' % (i + 1) for i in range(256)]
        elif sys.platform.startswith('linux') or sys.platform.startswith('cygwin'):
            ports = glob.glob('/dev/tty[A-Za-z]*')
        elif sys.platform.startswith('darwin'):
            ports = glob.glob('/dev/tty.*')
        else:
            raise EnvironmentError('Unsupported platform')

        result = []
        for port in ports:
            try:
                s = serial.Serial(port)
                s.close()
                result.append(port)
            except serial.SerialException as e:
                print(f"Error opening port {port}: {e}")
            except Exception as e:
                print(f"Unexpected error: {e}")
        return result

    def connect(self, device):
        try:
            client_port = serial.Serial(port=device, baudrate=9600, stopbits=1, bytesize=8, timeout=1, parity=serial.PARITY_NONE)
            if not client_port.isOpen():
                try:
                    client_port.open()
                    self.connected = True
                    self.client_port = client_port
                    return 0
                except Exception as e:
                    print("Connection error: {}".format(e))
                    self.connected = False
                    return -1
            else:
                self.connected = True
                self.clientPort = client_port
                return 0

        except Exception as e:
            print("Connection error: {}".format(e))
            self.connected = False
            return -1
        return 0

    def disconnect(self):
        try:
            self.clientPort.close()
            self.connected = False
        except Exception as e:
            print("Disconnection error: {}".format(e))
            self.connected = False
            return -1
        return 0
