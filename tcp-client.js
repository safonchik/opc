import ModbusTCPClient from './modbus-tcp-client.js';

const mbTCPClient = new ModbusTCPClient({host: '127.0.0.1'});

mbTCPClient.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
], 100, data => {
    console.log(data.value); 
})

setInterval(() => {
    mbTCPClient.writeSingleRegister(1, 15);
}, 2000)