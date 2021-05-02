const { WallBlock, DoorBlock, FloorBlock, ProblemBlock } = require("./blockObject");
const MapObject = require("./mapObject");
const PlayerObject = require("./playerObject");

const { MSG } = require('../constant');

const MOVE = Object.freeze({
    'KeyUp': { x: 0, y: -1 },
    'KeyDown': { x: 0, y: 1 },
    'KeyLeft': { x: -1, y: 0 },
    'KeyRight': { x: 1, y: 0 }
})

const isEqual = (first, second) => {
    return JSON.stringify(first) === JSON.stringify(second);
}

class Game {
    constructor() {
        this.sockets = {};
        // this.playSocket = {}; // TO
        // this.spectateSocket = {}; // TODO

        this.turn = 0;
        this.time = 30;
        this.map = new MapObject();
        this.showRange = { width: 4, height: 3 };
        this.io = null;
        this.players = new Map();
        this.joinedAA = new Set();
        this.prepareAchievement();
        setInterval(this.update.bind(this, 1), this.time);
    }

    prepareAchievement() {
        for (var [blockEventID, blockEvent] of Object.entries(this.map.achievement.blockEvents)) {
            blockEvent.rankings = [];
        }
    }

    addPlayer(socket, AA, name) {
        var socketID = socket.id;
        var pos = this.map.startPos;
        var player = new PlayerObject(socketID, AA, name, pos.x, pos.y, this.map);
        this.players.set(socketID, player);
        this.joinedAA.add(AA);
    }

    removePlayer(id) {
        if (this.players.has(id)) {
            var player = this.players.get(id);
            var AA = player.AA;
            ''
            this.joinedAA.delete(AA);
            this.players.delete(id);
        }
    }

    updatePlayer(player) {
        player.usingFlash = false;
        var nextX = player.x + player.dir.x;
        var nextY = player.y + player.dir.y;
        var command = player.commandQueue.pop();
        if (!(player.canMove)) { return }
        switch (command) {
            case null:
                break;
            case 'ShiftKeyUp':
            case 'ShiftKeyDown':
            case 'ShiftKeyLeft':
            case 'ShiftKeyRight':
                var commandDir = command.slice(5);
                var dir = MOVE[commandDir];
                player.dir = dir;
                break;
            case 'KeyUp':
            case 'KeyDown':
            case 'KeyLeft':
            case 'KeyRight':
                var dir = MOVE[command];
                player.dir = dir;
                var newX = player.x + dir.x;
                var newY = player.y + dir.y;
                var curblock = this.map.getBlock(player.x, player.y)
                var newblock = this.map.getBlock(newX, newY);
                if (curblock instanceof FloorBlock && curblock.existTrap()) {
                    player.canMove = false;
                    curblock.deleteTrap();
                    this.sockets[player.socketID].emit(MSG.SEND_PROBLEM, "trap");
                } else if (newblock !== null && player.canPass(newblock)) {
                    player.x = newX;
                    player.y = newY;
                    var newPos = [newX, newY];
                    for (let [blockEventID, blockEvent] of Object.entries(this.map.achievement.blockEvents)) {
                        if (blockEvent.leftrank > 0 && !(blockEvent.rankings.includes(player.socketID)) && blockEvent.blocks.some(block => isEqual(block, newPos))) {
                            this.io.emit(MSG.SEND_ACHIEVEMENT, player.AA + ' ' + blockEvent.message);
                            console.log(player.AA + ' ' + blockEvent.message);
                            blockEvent.leftrank--;
                            blockEvent.rankings.push(player.socketID);
                        }
                    }
                }
                break;
            case 'KeyInteract':
                var dir = player.dir;
                var block = this.map.getBlock(nextX, nextY);
                if (block !== null && block instanceof ProblemBlock) {
                    if(block.id.slice(0,1) =='X'){//Gift block
                        player.solve(block.id, block.reward)
                    }
                    else{
                        player.canMove = false;
                        this.sockets[player.socketID].emit(MSG.SEND_PROBLEM, block.id);
                    }
                }
                break;
            case 'KeyAnswer':
                console.log('Error | No need key');
                break;
            case 'KeyTrap':
                if (player.inventory.get("trap") > 0) {
                    var block = this.map.getBlock(nextX, nextY);
                    if (block !== null && block instanceof FloorBlock) {
                        player.useTrap(block);
                    }
                }
                break;
            case 'KeyFlash':
                if (player.inventory.get("flash") > 0) {
                    player.useFlash();
                }
                break;
            case 'KeyHint':
                if (player.inventory.get("hint") > 0) {
                    var block = this.map.getBlock(nextX, nextY);
                    if (block !== null && block instanceof ProblemBlock) {
                        player.useHint();
                        this.sockets[player.socketID].emit(MSG.SEND_HINT, block.id);
                    }
                }
                break;
            case 'KeyHammer':
                if (player.inventory.get("hammer") > 0) {
                    var block = this.map.getBlock(nextX, nextY);
                    if (block !== null && block instanceof WallBlock && block.weak) {
                        this.map.destroyBlock(nextX, nextY, 'W');
                        player.useHammer();
                    } else if (block !== null && block instanceof DoorBlock) {
                        this.map.destroyBlock(nextX, nextY, 'D');
                        player.useHammer();
                    } else if (block !== null && block instanceof FloorBlock) {
                        this.map.destroyBlock(nextX, nextY, 'F');
                        player.useHammer();
                    }
                }
                player.score += 50;
                break;
            default:
                console.log('Error | Impossible key');
        }
    }

    update() {
        this.turn++;
        if (this.turn % 200 === 0) {
            console.log(`Game | Turn ${this.turn} | ${Array.from(this.joinedAA.keys())}`);
        }
        for (let [socketID, player] of this.players) {
            this.updatePlayer(player);
        }

        // for (let [socketID, player] of Object.entries(this.sockets)) {
        // flashlight, trap
        // 만약 문제 봐야 할 상황이면 문제도 띄워줌
        // }
        this.show();
    }

    showAll() {
        // 관리자 용
    }

    show() {
        for (let [socketID, player] of this.players) {
            var socket = this.sockets[socketID];
            var data = this.map.show(player, this.showRange, this.players);
            socket.emit(MSG.UPDATE_GAME, data);
        }
    }
}

module.exports = Game;