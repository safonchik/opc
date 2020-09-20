"use strict";
import { EventEmitter } from "./eventEmitter.js";
import Modbus from 'jsmodbus';
import SerialPort from 'serialport';
import net from 'net';

const defaultOptions = {
    baudRate: 115200,
    parity: 'none',
    stopbits: 1,
    reconnect: {
        timeout: 1000,
        attempts: 10
    }
}


export default class {
    _defaultID = 1;
    _defaultReconnectTimeout = 1000;
    _defaultBaudRate = 115200;
    _defaulrParity = 'none';
    _defaultStopBits = 1;
    _options = null

    socket = null;
    client = null;
    // stream = new Readable({ read: () => true });
    dataStream = new EventEmitter();
    _opened = false;
    _options = defaultOptions;
    _listen = null;
    connectFn = null;
    constructor(socket, client, connectFn, getValueFn) {
        this.socket = socket;
        this.client = client;
        this.connectFn = connectFn;

        this.socket.on("open", () => {
            this._opened = true;
            console.log('Modbus client opened');
        })
        this.socket.on("connect", () => {
            this._opened = true;
            console.log('Modbus client connect');
        })
        this.socket.on("close", () => {
            console.log('Modbus closed!');
            this._opened = false;
            this.reconnect()
        })
        this.socket.on("error", (err) => {
            console.log('Modbus error! Try reconnect...');
            this._opened = false;
            this.reconnect()
        })
        this.connectFn();
    }
    _await = false;
    reconnect() {
        if (!this._await) {
            this._await = true;
            setTimeout(() => {
                this.connectFn();
                this._await = false;
            }, 1000)
        } 
    }

    setListen(listen, interval = 500, callback) {
        const i = setInterval(() => {
            if (this._opened) {
                listen.forEach((el) => {
                    this.client[el.func](el.address, el.count)
                        .then((resp) => {
                            const data = {
                                id: el.id,
                                timestamp: new Date(),
                                func: el.func,
                                address: el.address,
                                count: el.count,
                                value: resp.response.body.valuesAsArray //getValueFn ? getValueFn(resp) : resp
                            }
                            callback(data)
                            // this.dataStream.emit(el.id, data)
                        })
                        .catch(() => {
                            console.log('Ошибка при попытке чтения данных!')
                            // this._opened = false;
                        })
                });
            }
        }, interval)
    }
}

