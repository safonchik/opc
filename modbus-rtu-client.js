"use strict";
import Modbus from 'jsmodbus';
import SerialPort from 'serialport';
import ModbusClient from './modbus-client.js';


export default class extends ModbusClient {
    constructor(options) {
        const socket = new SerialPort(options.port, {
            baudRate: options.baudRate || 115200,
            parity: options.parity || 'none',
            stopBits: options.stopBits || 1,
        })
        const client = new Modbus.client.RTU(socket, options.id || 1)
        super(socket, client, (data) => data.response.body)
    }
}

