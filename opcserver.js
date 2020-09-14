import opcserver from "node-opcua";

const { OPCUAServer, Variant, DataType } = opcserver;

export class OPCServer {
    server = null;
    _isInitialized = false;
    _namespace = null;
    _addressSpace = null;
    _devices = [];
    addVariable(device, name, type, getFn, setFn) {
        if (!this._devices[device]) {
            const d = this._namespace.addObject({
                organizedBy: this._addressSpace.rootFolder.objects,
                browseName: device
            })
            this._devices[device] = d;
        }
        this._namespace.addVariable({
            componentOf: this._devices[device],
            browseName: name,
            dataType: type,
            value: {
                get: function () {
                    return new Variant({ dataType: DataType[type], value: getFn() });
                }
            }
        });

    }
    constructor(variables) {
        this.server = new OPCUAServer({
            port: 4334, // the port of the listening socket of the server
            resourcePath: "/UA/AWT", // this path will be added to the endpoint resource name
            buildInfo: {
                productName: "AWT_OPC",
                buildNumber: "7658",
                buildDate: new Date(2014, 5, 2)
            }
        });
        this.server.initialize(() => {
            this._isInitialized = true;
            this._addressSpace = this.server.engine.addressSpace;
            this._namespace = this._addressSpace.getOwnNamespace();
            variables.forEach((v) => this.addVariable(v.device, v.name, v.type, v.getFn))
            this.server.start(() => {
                console.log("Server is now listening ... ( press CTRL+C to stop)");
                console.log("port ", this.server.endpoints[0].port);
                const endpointUrl = this.server.endpoints[0].endpointDescriptions()[0].endpointUrl;
                console.log(" the primary server endpoint url is ", endpointUrl);
            });
        })
    }
}