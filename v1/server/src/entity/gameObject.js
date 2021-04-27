const ProblemBlock = require("./blockObject");
const MapObject = require("./mapObject");
const PlayerObject = require("./playerObject");
const mapData = require('./mapData.json');
const MSG = require('../constant');

const MOVE = Object.freeze({
    'KeyW': {
        x: 0,
        y: 1
    },
    'KeyS': {
        x: 0,
        y: -1
    },
    'KeyA': {
        x: -1,
        y: 0
    },
    'KeyD': {
        x: 1,
        y: 0
    }
})

class Game {
    constructor() {
        this.sockets = {};
        // this.playSocket = {}; // TODO
        // this.spectateSocket = {}; // TODO

        this.time = 1000;

        this.map = new MapObject(mapData);
        this.showRange = {
            width: 5,
            height: 3
        };
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
            console.log('No player exists');
        }

    }

    movePlayer(player) {
        var command = player.command.pop();
        switch (command) {
            case 'KeyW':
            case 'KeyA':
            case 'KeyS':
            case 'KeyD':
                var dir = MOVE[command]
                player.dir = dir;
                var newX = player.x + dir.x;
                var newY = player.y + dir.y;
                var block = this.map.getBlock(newX, newY);
                if (block !== null && player.canPass(block)) {
                    player.x = newX;
                    player.y = newY;
                }
                break;
            case 'KeyF':
                var newX = player.x + dir.x;
                var newY = player.y + dir.y;
                var block = this.map.getBlock(newX, newY);
                if (block !== null && block instanceof ProblemBlock) {
                    block.show(player)
                }
        }
    }

    update() {
        console.log('Turn change - Player')
        Object.entries(this.players).forEach(([key, value]) => { console.log(key); });

        for (let [socketID, player] of Object.entries(this.players)) {
            this.movePlayer(player)
        }

        for (let [socketID, player] of Object.entries(this.players)) {
            // flashlight, trap
            // 만약 문제 봐야 할 상황이면 문제도 띄워줌
        }
        this.show();
    }

    showAll() {
        // 관리자 용
    }

    show() {
        for (let [socketID, player] of Object.entries(this.players)) {
            var socket = this.sockets[socketID];
            var visibleMap = this.map.show(player, this.showRange); //DATA
            console.log('??!?')
            socket.emit(MSG.UPDATE_GAME, visibleMap);
        }
    }

}

module.exports = Game;