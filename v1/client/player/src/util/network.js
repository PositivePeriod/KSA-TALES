import { InputDeque } from './deque.js';
const MSG = Object.freeze({
    CONNECT_SERVER: 'connection', // no need

    JOIN_PLAY: 'joinPlay',
    HANDLE_INPUT: 'handleInput',
    LEAVE_PLAY: 'leavePlay',

    JOIN_SPECTATE: 'joinSpectate',
    LEAVE_SPECTATE: 'joinSpectate',

    UPDATE_GAME: 'updateGame',

    DISCONNECT_SERVER: 'disconnect',
})

export class Network {
    constructor() {
        const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
        this.socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });

        window.addEventListener("beforeunload", this.disconnect.bind(this));

        this.commandQueue = new InputDeque();
        this.time = 1000;
        setInterval(this.sendCommand.bind(this), this.time);
    }

    connect() {
        this.socket.on(MSG.JOIN_PLAY, this.joinGame.bind(this));
        this.socket.on(MSG.UPDATE_GAME, this.updateGame.bind(this));
        this.socket.on(MSG.DISCONNECT_SERVER, this.disconnectFromServer.bind(this));
    }

    joinGame(AA, code, name) {
        var data = { 'AA': AA, 'code': code, 'name': name }
        console.log('joinGame', data);
        this.socket.emit(MSG.JOIN_PLAY, data);
    }

    updateGame(data) {
        console.log('updateGame', data);
    }

    tryToSendCommand(command) {
        if (this.commandQueue.getSize() < 10) {
            this.commandQueue.push(command);
        }
    }

    sendCommand(command) {
        var command = this.commandQueue.pop();
        if (command !== null) {
            this.socket.emit(MSG.HANDLE_INPUT, command);
        }
    }

    disconnect() {
        this.socket.emit(MSG.DISCONNECT_SERVER);
    }

    disconnectFromServer() {
        // redirect to main page
    }
}