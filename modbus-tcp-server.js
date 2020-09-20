import Modbus from 'jsmodbus';
import net from 'net';

export default class {
    socket = null;
    server = null;
    _opened = false;

    constructor(ip, port = 502) {
        this.socket = net.Server();
        this.server = new Modbus.server.TCP(this.socket, { holding: Buffer.alloc(10) });
        this.socket.listen(port, ip);
        this.socket.on("connection", () => {
            console.log('TCP server opened');
            this._opened = true;
        })
        this.socket.on("close", () => {
            console.log('TCP serverclosed!');
            this._opened = false;
            this.reconnect()
        })
        this.socket.on("error", (err) => {
            console.log('TCP server error! Try reconnect...');
            this._opened = false;
            this.reconnect()
        })
    }
    _await = false;
    reconnect() {
        if (!this._await) {
            this._await = true;
            setTimeout(() => {
                if (!this.socket.opening) this.socket.open();
                this._await = false;
            }, 1000)
        } 
    }
    write(address, value) {
        if (this._opened) {
            this.server.holding.writeUInt16BE(value, address)
        }
    }
}
