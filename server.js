import { OPCServer } from './opcserver.js'
import ModbusTCPClient from './modbus-tcp-client.js';
import websocket from 'websocket';
import http from 'http';

const mbTCPClient = new ModbusTCPClient({host: '10.8.0.2'});

let h0 = 0;

mbTCPClient.setListen([
    { id: 'h0', func: "readHoldingRegisters", address: 0, count: 1 },
], 300, data => {
    console.log(data.value); 
    h0 = data.value[0];
})

const variables = [{device: 'pr200', name: 'h0', type: 'Double', getFn: () => {
    console.log(h0);
    return h0;
}}];
const opc = new OPCServer(variables);


var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, '82.146.60.164', function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});
 
const wsServer = new websocket.server({
    httpServer: server,
    autoAcceptConnections: true
});
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}