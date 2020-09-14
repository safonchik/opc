import { OPCServer } from './opcserver.js';
import { ModbusClient, ModbusTCPServer } from './modbus.js';

const mbRTUClient = new ModbusClient();
const mbTCPClient = new ModbusClient();
const mbTCPServer = new ModbusTCPServer();

mbRTUClient.connectRTU("COM4");
mbRTUClient.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
    // { id: 'i0', func: "readCoils", address: 3, count: 1 },
], 200, data => {
    mbTCPServer.write(data.address, data.value)
})
mbTCPClient.connectTCP()

let h0 = 0;

mbTCPClient.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
], 200, data => {
    h0 = data.value;
    console.log(data.value);
})

const variables = [{device: 'pr200', name: 'h0', type: 'Double', getFn: () => h0}];
const opc = new OPCServer(variables);
