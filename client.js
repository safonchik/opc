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