import { ModbusClient, ModbusTCPServer } from './modbus.js';

const mbRTUClient = new ModbusClient();
const mbTCPServer = new ModbusTCPServer();

mbRTUClient.connectRTU("COM5");
mbRTUClient.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
    // { id: 'i0', func: "readCoils", address: 3, count: 1 },
], 200, data => {
    mbTCPServer.write(data.address, data.value)
    console.log(data.value)
})