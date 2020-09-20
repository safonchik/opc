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


var server = http.createServer(function(req, res) {
    console.log((new Date()) + ' Received request for ' + req.url);
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
      };
    
      if (req.method === 'OPTIONS') {
        res.writeHead(204, headers);
        res.end();
        return;
      }
    
      if (['GET', 'POST'].indexOf(req.method) > -1) {
        res.writeHead(200, headers);
        res.end('Hello World');
        return;
      }
    
      res.writeHead(405, headers);
      res.end(`${req.method} is not allowed for the request.`);
    request.headers()
    // response.writeHead(404);
    // response.end();
});
server.listen(8080, function() {
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
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});