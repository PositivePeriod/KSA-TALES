const { WallBlock, DoorBlock, FloorBlock, ProblemBlock } = require("./blockObject");
const MapObject = require("./mapObject");
const PlayerObject = require("./playerObject");

const { MSG, PROBLEMS, TRAPS } = require('../constant');

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

        this.savedData = {}; // player => dict { x, y, inven,isTraped }
        // AAtoCODE.forEach((AA,key,map)=>{
        //     this.savedData[AA] = {

        //     }
        // });

        this.turn = 0;
        this.time = 30;
        this.map = new MapObject();
        this.showRange = { width: 4, height: 3 };
        this.io = null;
        this.players = new Map();
        this.joinedAA = new Set();
        this.leaderboard = {};
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

        if (this.savedData[AA] !== undefined) {
            player.applyData(this.savedData[AA], this.map);
        }


        this.players.set(socketID, player);
        this.joinedAA.add(AA);
        this.leaderboard[AA] = { 'name': name, 'progress': 1 };
        this.io.emit(MSG.SEND_LEADERBOARD, this.leaderboard); // 리더보드 공지
    }

    removePlayer(id) {
        if (this.players.has(id)) {
            var player = this.players.get(id);
            var AA = player.AA;
            this.joinedAA.delete(AA);
            this.players.delete(id);
        }
    }

    updatePlayer(player) {
        player.checkFlash();
        this.savedData[player.AA] = player.toData();

        var nextX = player.x + player.dir.x;
        var nextY = player.y + player.dir.y;
        var data = player.commandQueue.pop();

        if (data === null) { return }
        var command = data.command;
        // var problemID = player.watchProblem.id;
        // var problemReWard = player.watchProblem.reward;
        // var problem = PROBLEMS[player.watchProblem.id];
        // var problemHint = player.hint;
        // var problemAnswer = player.answer;

        if ((player.watchTrap !== null) && (command !== 'KeyAnswer')) {
            return;
        }

        switch (command) {
            case 'KeyInteract':
                var block = this.map.getBlock(nextX, nextY);
                if (block !== null && block instanceof ProblemBlock) {
                    var blockID = block.id;
                    var blockReward = block.reward;

                    if (blockID.slice(0, 1) == 'X') { //Gift block
                        player.solve(blockID, blockReward)
                    } else if (player.watchProblem === null) { // Want to show problem
                        player.watchProblem = block;
                        player.canMove = false;
                        this.sockets[player.socketID].emit(MSG.SEND_PROBLEM, { "command": "show", "data": blockID });
                    } else { // Want to hide problem
                        player.watchProblem = null;
                        player.canMove = true;
                        this.sockets[player.socketID].emit(MSG.SEND_PROBLEM, { "command": "hide" });
                    }
                }
                return;
            case 'KeyHint':
                if ((player.watchProblem !== null) && (player.inventory.get("hint") > 0)) {
                    var problemID = player.watchProblem.id;
                    var problem = PROBLEMS[problemID];
                    var problemHint = problem.hint;
                    player.useHint();
                    this.sockets[player.socketID].emit(MSG.SEND_HINT, problemHint);
                }
                return;
            case 'KeyAnswer':
                if (player.watchProblem !== null) {
                    var problemID = player.watchProblem.id;
                    var problem = PROBLEMS[problemID];
                    var problemAnswer = problem.answer;
                    var problemReward = player.watchProblem.reward;
                    if (problemAnswer.trim().toLowerCase() === data.data.trim().toLowerCase()) {
                        player.solve(problemID, problemReward);
                        this.sockets[player.socketID].emit(MSG.SEND_PROBLEM, { "command": "solve", "data": true });
                        // cause hideProblem in client
                        player.watchProblem = null;
                        player.canMove = true;
                    } else {
                        this.sockets[player.socketID].emit(MSG.SEND_PROBLEM, { "command": "solve", "data": false });
                    }
                }
                if (player.watchTrap !== null) {
                    var problemID = player.watchTrap;
                    var problem = TRAPS[problemID];
                    var problemAnswer = problem.answer;
                    if (problemAnswer.trim().toLowerCase() === data.data.trim().toLowerCase()) {
                        this.sockets[player.socketID].emit(MSG.SEND_PROBLEM, { "command": "solveTrap", "data": true });
                        // cause hideProblem in client
                        player.watchTrap = null;
                        player.canMove = true;
                    } else {
                        this.sockets[player.socketID].emit(MSG.SEND_PROBLEM, { "command": "solveTrap", "data": false });
                    }
                }
                return;
        }
        if (!player.canMove) { return }

        switch (command) {
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
                    var trapname = curblock.trapname;
                    curblock.deleteTrap();

                    player.trapNum = (player.trapNum + 1) % 10
                    player.watchTrap = player.trapNum;
                    player.canMove = false;
                    var trapProblemID = TRAPS[player.watchTrap].id;
                    this.sockets[player.socketID].emit(MSG.SEND_PROBLEM, { "command": "showTrap", "data": `trap${trapProblemID}` }); // Trap 걸림

                    this.io.emit(MSG.SEND_MESSAGE, player.name + ' trapped in ' + trapname + "'s trap"); // 공지
                } else if (newblock !== null && player.canPass(newblock)) {
                    player.x = newX;
                    player.y = newY;
                    var newPos = [newX, newY];
                    for (let [blockEventID, blockEvent] of Object.entries(this.map.achievement.blockEvents)) {
                        if (!(blockEvent.rankings.includes(player.socketID)) && blockEvent.blocks.some(block => isEqual(block, newPos))) {
                            this.leaderboard[player.AA].progress++;
                            this.io.emit(MSG.SEND_LEADERBOARD, this.leaderboard); // 리더보드 공지
                            if (blockEvent.leftrank > 0) {
                                this.io.emit(MSG.SEND_MESSAGE, player.AA + ' ' + blockEvent.message); // 공지
                                console.log(player.AA + ' ' + blockEvent.message);
                                blockEvent.leftrank--;
                                blockEvent.rankings.push(player.socketID); // 최초 room
                            }
                        }
                    }
                }
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
                player.useFlash();
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
                break;
            default:
                console.log('Error | Impossible key', command);
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