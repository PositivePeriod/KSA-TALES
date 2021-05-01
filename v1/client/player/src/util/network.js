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
        this.socket.on(MSG.SEND_PROBLEM, this.useProblem.bind(this));
        this.socket.on(MSG.SEND_HINT, this.showHint.bind(this));
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
        if (this.commandQueue.getSize() < 1) {
            this.commandQueue.push(command);
        }
    }

    sendCommand() {
        var command = this.commandQueue.pop();
        if (command !== null) {
            this.socket.emit(MSG.HANDLE_INPUT, command);
        }
    }

    useProblem(problemID) {
        var problem = document.getElementById('problem');
        if (!problem.hidden) {
            this.showProblem(problemID);
        } else {
            this.hideProblem();
        }
    }

    showProblem(problemID) {
        console.log(problemID);

        const asset = new Image();
        asset.src = `/assets/${problemID}.png`;
        asset.onload = () => {
            const hint = document.getElementById('hint');
            hint.hidden = true;

            const gameCanvas = document.getElementById('gameCanvas');
            gameCanvas.hidden = true;

            const problem = document.getElementById('problem');
            problem.hidden = false;
            problem.appendChild(asset);
        };
    }

    hideProblem() {
        const hint = document.getElementById('hint');
        hint.hidden = true;

        const problem = document.getElementById('problem');
        problem.hidden = true;
        while (problem.firstChild) {
            problem.removeChild(problem.lastChild);
        }

        const gameCanvas = document.getElementById('gameCanvas');
        gameCanvas.hidden = false;
    }

    showHint(hintMSG) {
        console.log(hintMSG);
        const hint = document.getElementById('hint');
        hint.innerText = hintMSG;
        hint.hidden = false;
    }

    getAchievement(message) {
        console.log(message)
        // TODO / should load to html
    }

    disconnect() {
        this.socket.emit(MSG.DISCONNECT_SERVER, null);
    }

    disconnectFromServer() {
        window.location.href = `/register`;
    }
}