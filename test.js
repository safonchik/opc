const { OPCUAServer, Variant, DataType } = require("node-opcua");
const Modbus = require('jsmodbus')
const SerialPort = require('serialport')
const socket485 = new SerialPort('COM5', {
  baudRate: 115200,
  parity: 'none',
  stopbits: 1
})
const server = new OPCUAServer({
  port: 4334, // the port of the listening socket of the server
  resourcePath: "/UA/AWT", // this path will be added to the endpoint resource name
   buildInfo : {
      productName: "MySampleServer1",
      buildNumber: "7658",
      buildDate: new Date(2014,5,2)
  }
});

let output = 0;
server.initialize(() => {
  const addressSpace = server.engine.addressSpace;
  const namespace = addressSpace.getOwnNamespace();
  const device = namespace.addObject({
    organizedBy: addressSpace.rootFolder.objects,
    browseName: "device"
  });
  namespace.addVariable({
    componentOf: device,
    browseName: "V1",
    dataType: "Double",
    value: {
        get: function () {
            return new Variant({dataType: DataType.Double, value: output });
        }
    }
  });
  server.start(function() {
    console.log("Server is now listening ... ( press CTRL+C to stop)");
    console.log("port ", server.endpoints[0].port);
    const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
    console.log(" the primary server endpoint url is ", endpointUrl );
  });
})

//const mbClient = new Modbus.client.RTU(socket485, 1)
const mbClient = new Modbus.client.TCP(socket485, 1)
Modbus.server.TCP()

socket485.on('close', function () {
  console.log(arguments)
})

socket485.on('open', function () {
    console.log('Connected!')
   setInterval(() => {
        mbClient.readHoldingRegisters(0, 1)
        .then(function (resp) {
          output = resp.response.body.valuesAsArray;
          console.log(resp.response.body.valuesAsArray)
	//socket.close()
        }).catch(function () {
          console.error(arguments)
          socket485.close()
        })
    }, 500)
})

socket485.on('data', function () {
  //console.log(arguments)
})

socket485.on('error', console.error)