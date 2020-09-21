import { OPCServer } from './opcserver.js'
import ModbusTCPClient from './modbus-tcp-client.js';
import websocket from 'websocket';
import http from 'http';
import si from 'socket.io';


let sequenceNumberByClient = new Map();
let h0 = 0;
let v = 0;

si.listen(8080).on('connection', socket => {
    console.info(`Client connected [id=${socket.id}]`);
    socket.on("data", d => {
        console.log('websocket принимает данные!')
        if (v === 0) v = 1; else v = 0;
        mbTCPClient.writeSingleRegister(513, v)
    });
    sequenceNumberByClient.set(socket, 1);
    socket.on("disconnect", () => {
        sequenceNumberByClient.delete(socket);
        console.info(`Client gone [id=${socket.id}]`);
    });
});

const mbTCPClient = new ModbusTCPClient({ host: '10.8.0.2' });
// setInterval(() => {
//     mbTCPClient.writeSingleRegister(513, v)

// }, 1000);
mbTCPClient.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
], 300, data => {
    console.log(data.value);
    for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
        client.emit("data", data.value[0]);
        sequenceNumberByClient.set(client, sequenceNumber + 1);
    }

    h0 = data.value[0];
})

const variables = [{
    device: 'pr200', name: 'h0', type: 'Double', getFn: () => {
        console.log(h0);
        return h0;
    }
}];
const opc = new OPCServer(variables);

