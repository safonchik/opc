import ModbusTCPServer from './modbus-tcp-server.js';


const mbTCPServer = new ModbusTCPServer({host: '10.8.0.2'});

setInterval(() => {
    mbTCPServer.write(0, 11);
}, 100)