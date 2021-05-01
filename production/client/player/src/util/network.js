import { InputDeque } from './deque.js';
import { MSG } from '../constant.js';

export class Network {
    constructor(map) {
        this.map = map;

        const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
        this.socket = io(`${socketProtocol}://${window.location.host}`);

        this.time = 50;
        this.commandQueue = new InputDeque();
        setInterval(this.sendCommand.bind(this), this.time);

        window.addEventListener("beforeunload", this.disconnect.bind(this));
    }

    connect() {
        this.socket.on(MSG.JOIN_PLAY, this.disconnectFromServer.bind(this));
        this.socket.on(MSG.LEAVE_PLAY, this.disconnectFromServer.bind(this));
        this.socket.on(MSG.UPDATE_GAME, this.updateGame.bind(this));
        this.socket.on(MSG.SEND_PROBLEM, this.getProblem.bind(this));
        this.socket.on(MSG.SEND_HINT, this.getHint.bind(this));
        this.socket.on(MSG.SEND_ACHIEVEMENT, this.getAchievement.bind(this));
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


    getProblem(problemID) {
        console.log(problemID);
        const asset = new Image();
        asset.src = `https://under-the-ksa.herokuapp.com/assets/${problemID}.png`;
        asset.onload = () => {
            // var gameCanvas = document.getElementById('gameCanvas');
            // gameCanvas.classList.add('invisible');
            // document.getElementById('gameFrame').hidden = true;
            var problem = document.getElementById('problem');
            while (problem.firstChild) {
                problem.removeChild(problem.lastChild);
            }
            problem.appendChild(asset);
            problem.hidden = false;

            // this.socket.emit(MSG.SEND_PROBLEM, data);
        };

    }

    getHint(problemID) {
        // TODO / should be changed to load hint image
        console.log(problemID);
        const asset = new Image();
        asset.src = `assets/${problemID}.png`;
        asset.onload = () => {
            var problem = document.getElementById('problem');
            while (problem.firstChild) {
                problem.removeChild(problem.lastChild);
            }
            problem.appendChild(asset);
            problem.classList.remove('invisible');
            problem.classList.add('visible');
            // this.socket.emit(MSG.SEND_PROBLEM, data);
        };
    }

    getAchievement(message) {
        console.log(message)
        // TODO / should load to html
    }

    disconnect() {
        this.socket.emit(MSG.DISCONNECT_SERVER, null);
    }

    disconnectFromServer() {
        window.location.href = 'https://under-the-ksa.herokuapp.com/register';
    }
}