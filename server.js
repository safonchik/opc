import { OPCServer } from './opcserver.js'
import ModbusTCPClient from './modbus-tcp-client.js';

const mbTCPClient = new ModbusTCPClient({host: '10.8.0.2'});

let h0 = 0;

mbTCPClient.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
], 100, data => {
    console.log(data.value); 
    h0 = data.value[0];
})

// const variables = [{device: 'pr200', name: 'h0', type: 'Double', getFn: () => {
//     console.log(h0);
//     return h0;
// }}];
// const opc = new OPCServer(variables);
