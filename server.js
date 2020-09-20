import { OPCServer } from './opcserver.js'
import ModbusTCPClient from './modbus-tcp-client';

const mbTCPClient = new ModbusTCPClient('10.8.0.3');


let h0 = 0;

mbTCPClient.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
], 200, data => {
    h0 = data.value[0];
    //console.log(data.value); 
})

const variables = [{device: 'pr200', name: 'h0', type: 'Double', getFn: () => {
    console.log(h0);
    return h0;
}}];
const opc = new OPCServer(variables);
