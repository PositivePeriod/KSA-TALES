import { InputDeque } from './deque.js';
import { MSG } from '../constant.js';
import { updateHTML } from './assets.js';

export class Network {
    constructor(map) {
        this.map = map;

        const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
        this.socket = io(`${socketProtocol}://${window.location.host}`);

        this.time = 20;
        this.commandQueue = new InputDeque();
        setInterval(this.sendCommand.bind(this), this.time);

        this.isShownProblem = false;

        window.addEventListener("beforeunload", this.disconnect.bind(this));
    }

    connect() {
        this.socket.on(MSG.JOIN_PLAY, this.disconnectFromServer.bind(this));
        this.socket.on(MSG.LEAVE_PLAY, this.disconnectFromServer.bind(this));
        this.socket.on(MSG.UPDATE_GAME, this.updateGame.bind(this));
        this.socket.on(MSG.SEND_PROBLEM, this.showProblem.bind(this));
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
            if (command === 'KeyInteract' && this.isShownProblem) {
                this.hideProblem();
                this.isShownProblem = false;
            } else {
                this.commandQueue.push(command);
            }
        }
    }

    sendCommand() {
        var command = this.commandQueue.pop();
        if (command !== null) {
            this.socket.emit(MSG.HANDLE_INPUT, command);
        }
    }

    useProblem(problemID) {
        console.log(problemID)
        var problem = document.getElementById('problem');
        if (!problem.classList.contains('hidden')) {
            console.log('show', problemID);
            this.isShownProblem = true;
            this.showProblem(problemID);
        } else {
            console.log('hide');
            this.hideProblem();
        }
    }

    showProblem(problemID) {
        
        document.getElementById('gameCanvas').classList.add('hidden');
        document.getElementById('problem').classList.remove('hidden');
        // document.getElementById('hint').classList.add('hidden');
        document.getElementById('answer').classList.remove('hidden');

        updateHTML(`/problems/${problemID}`);
        this.isShownProblem = true;
    }

    hideProblem() {
        document.getElementById('gameCanvas').classList.remove('hidden');
        document.getElementById('gameCanvas').hidden = true;
        document.getElementById('problem').classList.add('hidden');
        // document.getElementById('hint').classList.add('hidden');
        document.getElementById('answer').classList.add('hidden');

        const problem = document.getElementById('problem');
        while (problem.firstChild) {
            problem.removeChild(problem.lastChild);
        }
        this.isShownProblem = false;
    }

    showHint(hintMSG) {
        console.log(hintMSG);
        const hint = document.getElementById('hint');
        hint.innerText = hintMSG;
        document.getElementById('hint').classList.remove('hidden');
    }

    getAchievement(message) {
        console.log(message)
        // TODO / should load to html
    }

    disconnect() {
        this.socket.emit(MSG.DISCONNECT_SERVER, null);
    }

    disconnectFromServer() {
        console.log('disconnectFrom')
        window.location.href = `/register`;
    }
}