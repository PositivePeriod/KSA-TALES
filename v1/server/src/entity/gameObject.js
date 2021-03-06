const { FloorBlock, ProblemBlock } = require("./blockObject");
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

        this.time = 100;
        this.map = new MapObject();
        this.showRange = { width: 5, height: 3 };
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
        if (!this.joinedAA.has(AA)) {
            // if(true){
            var socketID = socket.id;
            var pos = this.map.startPos;
            var player = new PlayerObject(socketID, AA, name, pos.x, pos.y, this.map);
            this.players.set(socketID, player);
            this.joinedAA.add(AA);
        }
    }

    removePlayer(id) {
        if (this.players.has(id)) {
            var player = this.players.get(id);
            var AA = player.AA;
            console.log(player, player.AA);
            console.log(this.joinedAA.has(AA));
            this.joinedAA.delete(AA);
            console.log(this.joinedAA.has(AA));
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
                    player.canMove = false;
                    this.sockets[player.socketID].emit(MSG.SEND_PROBLEM, block.id);
                }
                break;
            case 'KeyAnswer':
                console.log('Error | No need key');
                break;
            case 'KeyTrap':
                if (player.trap > 0) {
                    var block = this.map.getBlock(nextX, nextY);
                    if (block !== null && block instanceof FloorBlock) {
                        player.useTrap(block);
                    }
                }
                break;
            case 'KeyFlash':
                if (player.flash > 0) {
                    player.useFlash();
                    console.log("Used Flash");
                }
                break;
            case 'KeyHint':
                if (player.hint > 0) {
                    var block = this.map.getBlock(nextX, nextY);
                    if (block !== null && block instanceof ProblemBlock) {
                        player.useHint();
                        this.sockets[player.socketID].emit(MSG.SEND_HINT, block.id);
                    }
                }
                break;
            case 'KeyHammer':
                if (player.hammer > 0) {
                    var block = this.map.getBlock(nextX, nextY);
                    if (block !== null && block instanceof WallBlock && block.weak) {
                        this.map.destroyBlock(nextX, nextY, 'W');
                        player.useHammer();
                    } else if (block !== null && block instanceof DoorBlock && block.weak) {
                        this.map.destroyBlock(nextX, nextY, 'D');
                        player.useHammer();
                    }
                }
                break;
            case 'KeyBulldozer':
                if (player.bulldozer > 0) {
                    var block = this.map.getBlock(nextX, nextY);
                    if (block !== null && block instanceof FloorBlock && block.existTrap()) {
                        player.useBulldozer(block);
                    }
                }
                default:
                    console.log('Error | Impossible key');
        }
    }

    update() {
        console.log(`Game | Turn Change | ${Array.from(this.joinedAA.keys())}`)
        for (let [socketID, player] of this.players) {
            this.updatePlayer(player);
        }

        // for (let [socketID, player] of Object.entries(this.sockets)) {
        // flashlight, trap
        // ?????? ?????? ?????? ??? ???????????? ????????? ?????????
        // }
        this.show();
    }

    showAll() {
        // ????????? ???
    }

    show() {
        var playerCoordList = [];
        for (let [socketID, player] of this.players) {
            playerCoordList.push({
                x: player.x,
                y: player.y,
                socketID: player.socketID,
                AA: player.AA
            })
        }
        for (let [socketID, player] of this.players) {
            var socket = this.sockets[socketID];
            var visibleMap = this.map.show(player, this.showRange, playerCoordList);
            socket.emit(MSG.UPDATE_GAME, visibleMap);
        }
    }
}

module.exports = Game;