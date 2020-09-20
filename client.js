import ModbusTCPServer from './modbus-tcp-server.js';
import ModbusRTUClient from './modbus-rtu-client.js';


const mbRTUClient = new ModbusRTUClient({port: "COM5"});
const mbTCPServer = new ModbusTCPServer();

mbRTUClient.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
    // { id: 'i0', func: "readCoils", address: 3, count: 1 },
], 200, data => {
    mbTCPServer.send(data.address, data.value)
})

