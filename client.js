import ModbusTCPServer from './modbus-tcp-server.js';
import ModbusRTUClient from './modbus-rtu-client.js';


const mbRTUClient = new ModbusRTUClient({port: "COM5"});
const mbTCPClient = new ModbusTCPClient({host: '10.8.0.1'})
mbTCPClient.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
    // { id: 'i0', func: "readCoils", address: 3, count: 1 },
], 200, data => {
    // mbTCPServer.send(data.address, data.value)
    mbRTUClient.writeSingleRegister(data.address, data.value);
})

// const mbTCPServer = new ModbusTCPServer();
// mbTCPServer.onPostWriteSingleRegister = (address, data) => {
//     mbRTUClient.writeSingleRegister(address, data);
// };

mbRTUClient.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
    // { id: 'i0', func: "readCoils", address: 3, count: 1 },
], 200, data => {
    // mbTCPServer.send(data.address, data.value)
    mbTCPClient.writeSingleRegister(data.address, data.value);
})

 ////h f