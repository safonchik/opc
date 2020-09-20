import ModbusTCPServer from './modbus-tcp-server';
import ModbusRTUClient from './modbus-rtu-client';

const mbRTUClient = new ModbusRTUClient("COM5");
const mbTCPServer = new ModbusTCPServer('10.8.0.2');

let count = 0;
mbRTUClient.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
    // { id: 'i0', func: "readCoils", address: 3, count: 1 },
], 100, data => {
    mbTCPServer.write(data.address, data.value)
    console.log(`Modbus RS485 RX (${data.func}) №${count} from ${data.address}/${data.count}: ${data.value}`)
    count++
})