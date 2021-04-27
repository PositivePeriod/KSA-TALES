const ProblemBlock = require("./blockObject");
const MapObject = require("./mapObject");
const PlayerObject = require("./playerObject");
const mapData = require('./mapData.json');

const MOVE = Object.freeze({ 'KeyW': { x: 0, y: 1 }, 'KeyS': { x: 0, y: -1 }, 'KeyA': { x: -1, y: 0 }, 'KeyD': { x: 1, y: 0 } })

class Game {
    constructor() {
        this.time = 1000;
        
        this.map = new MapObject(mapData);
        this.showRange = { width: 5, height: 3 };
        this.players = {}
        this.joinedAA = [];

        setInterval(this.update.bind(this, 1), this.time);
    }

    addPlayer(socket, AA, name) {
        if (!AA in this.joinedAA) {
            var socketID = socket.id;

            this.players[id] = new PlayerObject(socketID, AA, name, );
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
        for (const [playerID, socket] of Object.entries(this.players)) {
            var player = this.players[playerID];
            this.movePlayer(player)
        }

        for (const [playerID, socket] of Object.entries(this.players)) {
            var player = this.players[playerID];

            // socket emit 현재 상황 to each player
            // 만약 문제 봐야 할 상황이면 문제도 띄워줌
            this.movePlayer(player)
        }
    }

    showAll() {
        // 관리자 용
    }

    show() {
        this.players.forEach(player => {
            this.map.show(player, this.showRange);
        })
    }

}

module.exports = Game;