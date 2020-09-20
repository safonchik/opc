"use strict";
import Modbus from 'jsmodbus';
import ModbusClient from './modbus-client.js';
import net from 'net';

export default class extends ModbusClient {

    constructor(options) {
        const socket = new net.Socket();
        const client = new Modbus.client.TCP(socket, options.id || 1)
        super(socket, client, () => {
            if (!socket.connecting) socket.connect(options.port || 502, options.host);
        });
    }
}
