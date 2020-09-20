import ModbusTCPClient from './modbus-tcp-client.js';

const mbTCPClient = new ModbusTCPClient({host: '10.8.0.2'});

mbTCPClient.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
], 100, data => {
    console.log(data.value); 
})