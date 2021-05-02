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

        window.addEventListener("beforeunload", this.disconnect.bind(this));
    }

    connect() {
        this.socket.on(MSG.JOIN_PLAY, this.disconnectFromServer.bind(this));
        this.socket.on(MSG.LEAVE_PLAY, this.disconnectFromServer.bind(this));
        this.socket.on(MSG.UPDATE_GAME, this.updateGame.bind(this));
        this.socket.on(MSG.SEND_PROBLEM, this.sendProblem.bind(this));
        this.socket.on(MSG.SEND_HINT, this.showHint.bind(this));
        this.socket.on(MSG.SEND_MESSAGE, this.getAchievement.bind(this));
        this.socket.on(MSG.SEND_LEADERBOARD, this.updateLeaderboard.bind(this));
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
            var hint = document.getElementById('hint');
            if (hint.classList.contains('hidden') && command === "KeyHint") {
                return;
            }
            this.commandQueue.push({ "command": command });
        }
    }

    tryToSendAnswer(command) {
        if (this.commandQueue.getSize() < 1) {
            var answer = document.getElementById('answer').value;
            this.commandQueue.push({ "command": command, "data": answer });
        }
    }

    sendCommand() {
        var command = this.commandQueue.pop();
        if (command !== null) {
            this.socket.emit(MSG.HANDLE_INPUT, command);
        }
    }

    sendProblem(data) {
        var command = data.command;
        switch (command) {
            case "hide":
                console.log('hide')
                this.hideProblem();
                break;
            case "show":
                console.log('show', data.data);
                this.showProblem(data.data);
                break;
            case "solve":
                console.log('solve', data.data)
                if (data.data) { this.hideProblem(); }
                break;
            case "showTrap":
                console.log('showTrap');
                this.showProblem(data.data);
                break;
            case "solveTrap":
                console.log('solveTrap');
                if (data.data) { this.hideProblem(); }
                break;
        }
    }

    showProblem(problemID) {
        document.getElementById('messagelog').classList.add('hidden');
        document.getElementById('gameCanvas').classList.add('hidden');
        document.getElementById('problem').classList.remove('hidden');
        document.getElementById('hint').classList.add('hidden');
        var answer = document.getElementById('answer')
        answer.value = '';
        answer.classList.remove('hidden');
        answer.focus();
        updateHTML(`/problems/${problemID}`);
    }

    hideProblem() {
        document.getElementById('messagelog').classList.remove('hidden');
        document.getElementById('gameCanvas').classList.remove('hidden');
        document.getElementById('gameCanvas').hidden = true;
        document.getElementById('problem').classList.add('hidden');
        document.getElementById('hint').classList.add('hidden');
        document.getElementById('answer').classList.add('hidden');

        const problem = document.getElementById('problem');
        while (problem.firstChild) {
            problem.removeChild(problem.lastChild);
        }
    }

    showHint(hintMSG) {
        console.log('showHint', hintMSG);
        document.getElementById('hint').innerText = hintMSG;
        document.getElementById('hint').classList.remove('hidden');
    }

    getAchievement(message) {
        console.log(message)
        // TODO / should load to html
        var newMessage = document.createElement("div");
        newMessage.innerHTML = message;
        var messagelog = document.getElementById("messagelog");
        messagelog.appendChild(newMessage)
        messagelog.scrollTop = messagelog.scrollHeight;
    }

    updateLeaderboard(leaderboard) {
        this.map.leaderboard = leaderboard;
    }

    disconnect() {
        this.socket.emit(MSG.DISCONNECT_SERVER, null);
    }

    disconnectFromServer() {
        console.log('disconnectFrom')
        window.location.href = `/register`;
    }
}