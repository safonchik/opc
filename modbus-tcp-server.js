export class ModbusTCPServer {
    socket = null;
    server = null;
    _opened = false;

    constructor(port = 502) {
        this.socket = net.Server();
        this.server = new Modbus.server.TCP(this.socket, { holding: Buffer.alloc(10) });
        this.socket.listen(port, '10.8.0.2');
        this.server.on("connection", () => {
            console.log('TCP server opened');
            this._opened = true;
        })
    }
    write(address, value) {
        if (this._opened) {
            this.server.holding.writeUInt16BE(value, address)
        }
    }
}
