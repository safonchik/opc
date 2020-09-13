"use strict";
import { EventEmitter } from "./eventEmitter.js";
import Modbus from 'jsmodbus';
import SerialPort from 'serialport';
import net from 'net';

const defaultOptions = {
    baudRate: 115200,
    parity: 'none',
    stopbits: 1
}

class ModbusClient {
    socket = null;
    client = null;
    // stream = new Readable({ read: () => true });
    dataStream = new EventEmitter();
    _opened = false;
    constructor() {
    }
    connectTCP(port = 502, ip="127.0.0.1", id=1) {
        this.socket = new net.Socket();
        this.client = new Modbus.client.TCP(this.socket, id)
        this.socket.connect({
            'host': ip,
            'port': port
        });
        this.socket.on("connect", () => {
            this._opened = true;
            console.log('TCP client opened');
        })
    }
    connectRTU(port, id = 1, options = defaultOptions) {
        this.socket = new SerialPort(port, options)
        this.client = new Modbus.client.RTU(this.socket, id)
        this.socket.on("open", () => {
            this._opened = true;
            console.log('RTU client opened');
        })
    }

    setListen(listen, interval = 500) {
        setInterval(() => {
            if (this._opened) {
                listen.forEach((el) => {
                    this.client[el.func](el.address, el.count).then((resp) => {
                        const data = {
                            id: el.id,
                            timestamp: new Date(),
                            func: el.func,
                            address: el.address,
                            count: el.count,
                            value: resp.response.body.valuesAsArray
                        }
                        this.dataStream.emit(el.id, data)
                    }).catch(() => {
                        this.socket.close()
                    })
                });
            }
        }, interval)
    }
}


class ModbusTCPServer {
    socket = null;
    server = null;
    _opened = false;

    constructor(port = 502) {
        this.socket = net.Server();
        this.server = new Modbus.server.TCP(this.socket, { holding: Buffer.alloc(10000) });
        this.socket.listen(port, '127.0.0.1');
        this.server.on("connection", () => {
            console.log('TCP server opened');
            this._opened = true;
        })
    }
    write(address, value) {
        if (this._opened) {
            this.server.holding.writeUInt16BE(value, address)
        }
    }
}


const rtu = new ModbusClient();
const tcp = new ModbusTCPServer();
const client = new ModbusClient();
rtu.connectRTU("COM5");
rtu.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
    // { id: 'i0', func: "readCoils", address: 3, count: 1 },
], 200)
rtu.dataStream.subscribe("h0", data => {
    tcp.write(data.address, data.value)
})
client.connectTCP()
client.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
], 200)
client.dataStream.subscribe("h0", data => {
    console.log(data.value);
})