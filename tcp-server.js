import ModbusTCPServer from './modbus-tcp-server.js';


const mbTCPServer = new ModbusTCPServer();
mbTCPServer.onPostWriteSingleRegister = (data) => console.log(data);

setInterval(() => {
    mbTCPServer.send(0, 11);
}, 100)