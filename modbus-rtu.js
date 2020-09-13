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

class ModbusRTUClient {
    socket = null;
    client = null;
    // stream = new Readable({ read: () => true });
    dataStream = new EventEmitter();
    _opened = false;
    constructor(port, id = 1, options = defaultOptions) {
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

class ModbusTCPClient {
    socket = null;
    client = null;
    // stream = new Readable({ read: () => true });
    dataStream = new EventEmitter();
    _opened = false;
    constructor(port, id = 1, options = defaultOptions) {
        this.socket = new net.Socket();
        this.client = new Modbus.client.TCP(this.socket, id)
        this.socket.connect({
            'host': '127.0.0.1',
            'port': '502'
        });
        this.socket.on("connect", () => {
            this._opened = true;
            console.log('TCP client opened');
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

    constructor() {
        this.socket = net.Server();
        this.server = new Modbus.server.TCP(this.socket, { holding: Buffer.alloc(10000) });
        this.socket.listen(502, '127.0.0.1');
        this.server.on("connection", () => {
            console.log('TCP server opened');
            this._opened = true;
        })
        this.server.on('connection', function (client) {
            console.log('New Connection')
        })

        this.server.on('readCoils', function (request, response, send) {
            console.log('aaaa')
            /* Implement your own */

            response.body.coils[0] = true
            response.body.coils[1] = false

            send(response)
        })

        this.server.on('readHoldingRegisters', function (request, response, send) {
            console.log('readHoldingRegisters')
            /* Implement your own */

        })

        this.server.on('preWriteSingleRegister', (value, address) => {
            console.log('Write Single Register')
            console.log(this.server.holding);
            // console.log('Original {register, value}: {', address, ',', this.server.holding.readUInt16BE(address), '}')
        })

        this.server.on('WriteSingleRegister', (value, address) => {
            console.log('New {register, value}: {', address, ',', this.server.holding.readUInt16BE(address), '}')
        })

        this.server.on('writeMultipleCoils', (value) => {
            console.log('Write multiple coils - Existing: ', value)
        })

        this.server.on('postWriteMultipleCoils', function (value) {
            console.log('Write multiple coils - Complete: ', value)
        })

        /* server.on('writeMultipleRegisters', function (value) {
          console.log('Write multiple registers - Existing: ', value)
        }) */

        this.server.on('postWriteMultipleRegisters', function (value) {
            // console.log('Write multiple registers - Complete: ', holding.readUInt16BE(0))
        })
    }
    write(address, value) {
        if (this._opened) {
            this.server.holding.writeUInt16BE(value.value, 0)
        }
    }
}


const rtu = new ModbusRTUClient("COM5");
const tcp = new ModbusTCPServer();
const client = new ModbusTCPClient();
rtu.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
    // { id: 'i0', func: "readCoils", address: 3, count: 1 },
], 500)
rtu.dataStream.subscribe("h0", data => {
    tcp.write(0, data)
})
client.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
])
client.dataStream.subscribe("h0", data => {
    console.log(data.value);
})