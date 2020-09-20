import Modbus from 'jsmodbus';
import net from 'net';

export default class {
    socket = null;
    server = null;
    _opened = false;

    constructor(options = {}) {
        this.socket = net.createServer(socket => {
            socket.on("error", err => console.log('TCP server: ошибка чтения!'));
            socket.on("close", err => console.log('TCP server: соединение закрыто'));
        })
        this.socket.on("listening", (err) => {
            console.log('TCP listening...');
        })
        this.server = new Modbus.server.TCP(this.socket, { holding: Buffer.alloc(10000) });
        this.socket.listen(options.port || 502, () => {
            console.log('server is listening');
        });
    }
    write(address, value) {
        // if (this._opened) {
        this.server.holding.writeUInt16BE(value, address)
        // }
    }
}
