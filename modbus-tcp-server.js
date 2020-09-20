import Modbus from 'jsmodbus';
import net from 'net';

export default class {
    socket = null;
    server = new Modbus.server.TCP();
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
        // this.server.emit("writeMultipleCoils", {body: } )
        this.socket.listen(options.port || 502, () => {
            console.log('server is listening');
        });
    }
    send(address, value) {
        // if (this._opened) {
        this.server.holding.writeUInt16BE(value, address)
        // }
    }
    writeSingleRegister(address, value) {
        this.write('writeSingleRegister', address, value);
    }
    writeSingleCoil(address, value) {
        this.write('writeSingleCoil', address, value);
    }
    writeMultipleRegisters(address, values) {
        this.write('writeMultipleRegisters', address, value);
    }
    writeMultipleCoils(address, values) {
        this.write('writeMultipleCoils', address, value);
    }
    write(funcName, address, value) {
        if (this._opened) {
            this.emit(funcName, (address, value).then(function (resp) {
                console.log(`Modbus TX (singleRegister) to ${data.address}: ${value}`)
                console.log(resp)
              })).fail(function (err) {
                console.log(err)
              })
        }
    }
}
