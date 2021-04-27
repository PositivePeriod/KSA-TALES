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
    constructor(map) {
        this.map = map;

        const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
        this.socket = io(`${socketProtocol}://${window.location.host}`);

        this.time = 200;
        this.commandQueue = new InputDeque();
        setInterval(this.sendCommand.bind(this), this.time);

        window.addEventListener("beforeunload", this.disconnect.bind(this));
    }

    connect() {
        this.socket.on(MSG.JOIN_PLAY, this.joinGame.bind(this));
        this.socket.on(MSG.UPDATE_GAME, this.updateGame.bind(this));
        this.socket.on(MSG.DISCONNECT_SERVER, this.disconnectFromServer.bind(this));
        this.socket.on(MSG.LEAVE_PLAY, this.disconnectFromServer.bind(this));
        // this.socket.on(MSG.SEND_PROBLEM, this.getProblemFromServer.bind(this))
    }

    joinGame(AA, code, name) {
        var data = { 'AA': AA, 'code': code, 'name': name }
        this.socket.emit(MSG.JOIN_PLAY, data);
    }

    updateGame(data) {
        this.map.updateData(data);
        this.map.draw();
    }

    tryToSendCommand(command) {
        if (this.commandQueue.getSize() < 5) {
            this.commandQueue.push(command);
        }
    }

    sendCommand() {
        var command = this.commandQueue.pop();
        if (command !== null) {
            this.socket.emit(MSG.HANDLE_INPUT, command);
        }
    }

    getProblemFromServer(problemdata) {
        // TODO
    }

    disconnect() {
        this.socket.emit(MSG.DISCONNECT_SERVER, null);
    }

    disconnectFromServer() {
        // redirect to main page
    }
}