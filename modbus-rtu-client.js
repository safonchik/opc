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


export default class ModbusRTUClient {
    socket = null;
    client = null;
    // stream = new Readable({ read: () => true });
    dataStream = new EventEmitter();
    _opened = false;
    constructor(port, id = 1, options = defaultOptions) {
        this.connect(port, id, options);
    }
    connect(port, id = 1, options = defaultOptions) {
        this.socket = new SerialPort(port, options)
        this.client = new Modbus.client.RTU(this.socket, id)
        // this.socket.on("error", (err) => {
        //     this.socket.close();
        //     setTimeout(() => )
        // });
        this.socket.on("open", () => {
            this._opened = true;
            console.log('RTU client opened');
        })
    }

    setListen(listen, interval = 500, callback) {
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
                        callback(data)
                        this.dataStream.emit(el.id, data)
                    }).catch(() => {
                        this.socket.close()
                    })
                });
            }
        }, interval)
    }
}

