const { ProblemBlock } = require("./blockObject");
const MapObject = require("./mapObject");
const PlayerObject = require("./playerObject");

const { MSG } = require('../constant');

const MOVE = Object.freeze({
    'KeyUp': { x: 0, y: -1 },
    'KeyDown': { x: 0, y: 1 },
    'KeyLeft': { x: -1, y: 0 },
    'KeyRight': { x: 1, y: 0 }
})


class Game {
    constructor() {
        this.sockets = {};
        // this.playSocket = {}; // TODO
        // this.spectateSocket = {}; // TODO

        this.time = 300;
        this.map = new MapObject();
        this.showRange = { width: 5, height: 3 };
        this.io = null;
        this.players = {}
        this.joinedAA = [];

        setInterval(this.update.bind(this, 1), this.time);
    }

    addPlayer(socket, AA, name) {
        if (!(AA in this.joinedAA)) {
            var socketID = socket.id;
            var pos = this.map.startPos;
            this.players[socketID] = new PlayerObject(socketID, AA, name, pos.x, pos.y);
        }
    }

    removePlayer(id) {
        if (id in Object.keys(this.players)) {
            delete this.players[id];
        } else {
            console.log('Error | No such player exists');
        }

    }

    updatePlayer(player) {
        var command = player.commandQueue.pop();
        switch (command) {
            case null:
                break;
            case 'KeyUp':
            case 'KeyDown':
            case 'KeyLeft':
            case 'KeyRight':
                var dir = MOVE[command];
                player.dir = dir;
                var newX = player.x + dir.x;
                var newY = player.y + dir.y;
                var block = this.map.getBlock(newX, newY);
                if (block !== null && player.canPass(block)) {
                    player.x = newX;
                    player.y = newY;
                }
                break;
            case 'KeyInteract':
                var dir = player.dir;
                var newX = player.x + dir.x;
                var newY = player.y + dir.y;
                var block = this.map.getBlock(newX, newY);
                if (block !== null && block instanceof ProblemBlock) {
                    this.sockets[player.socketID].emit(MSG.SEND_PROBLEM, { "problemID": block.id });
                }
                break;
            case 'KeyAnswer':
                console.log('Error | No need key')
                break;
            default:
                console.log('Error | Impossible key')
        }
    }

    update() {
        console.log(`Game | Turn Change | ${this.players.length}`)
        for (let [socketID, player] of Object.entries(this.players)) {
            this.updatePlayer(player);
        }

        for (let [socketID, player] of Object.entries(this.sockets)) {
            // flashlight, trap
            // 만약 문제 봐야 할 상황이면 문제도 띄워줌
        }
        this.show();
    }

    showAll() {
        // 관리자 용
    }

    show() {
        var playerCoordList = [];
        for (let [socketID, player] of Object.entries(this.players)) {
            playerCoordList.push({
                x: player.x,
                y: player.y,
                socketID: player.socketID,
                AA: player.AA
            })
        }
        for (let [socketID, player] of Object.entries(this.players)) {
            var socket = this.sockets[socketID];
            var visibleMap = this.map.show(player, this.showRange, playerCoordList);
            socket.emit(MSG.UPDATE_GAME, visibleMap);
        }
    }
}

module.exports = Game;