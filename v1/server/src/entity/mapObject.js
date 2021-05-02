const { DoorBlock, FloorBlock, ProblemBlock, WallBlock } = require('./blockObject.js');

const mapNumber = 3;
const mapData = require(`../../data/mapData${mapNumber}.json`);
const { PROBLEMS } = require('../constant');
const Adjacents = [
    [1, 1],
    [1, 0],
    [1, -1],
    [0, 1],
    [0, -1],
    [-1, 1],
    [-1, 0],
    [-1, -1]
];
const isEqual = (first, second) => {
    return JSON.stringify(first) === JSON.stringify(second);
}

class MapObject {
    constructor() {
        this.width = mapData.width;
        this.height = mapData.height;
        this.achievement = mapData.achievement;
        this.blocks = Array.from(Array(this.width), () => Array(this.height).fill(null));
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                var roomIDs = mapData.room[y][x];
                var blockData = mapData.map[y][x];
                // console.log(blockData,y,x)
                var blockType = blockData.slice(0, 1);
                switch (blockType) {
                    case 'W':
                        var block = new WallBlock(x, y, roomIDs, (blockData.slice(1,2)=='W'));
                        break;
                    case 'D':
                        // console.log(blockData);
                        // console.log(mapData.door)
                        var problemIDs = mapData.door[blockData]
                        // var problemIDs = ['K1']
                        var block = new DoorBlock(x, y, roomIDs, problemIDs, mapData.weakBlock.some(coord => isEqual(coord, [x, y])));
                        break;
                    case 'P':
                        var problemData = mapData.problem[blockData];
                        // var id = "-1";
                        // var answer = "-1";
                        // var reward = "-1";
                        // console.log(problemData,blockData)
                        var id = problemData["id"];
                        if(id.slice(0,1) == "X"){
                            var answer = "X"
                        }
                        else{
                            var answer = PROBLEMS[id];
                        }
                        var reward = problemData["reward"];
                        var block = new ProblemBlock(x, y, roomIDs, id, answer, reward); // TODO
                        break;
                    case 'S':
                        this.startPos = { "x": x, "y": y };
                    case 'F':
                        var block = new FloorBlock(x, y, roomIDs);
                        if (blockData.slice(1, 2) === 'T') {
                            block.addTrap()
                        }
                        break;
                }
                this.blocks[x][y] = block;
            }
        }
    }

    getBlock(x, y) {
        return (0 <= x && x < this.width && 0 <= y && y < this.height) ? this.blocks[x][y] : null;
    }

    destroyBlock(x, y, blocktype) {
        var block = this.getBlock(x, y);
        if (blocktype === 'W') {
            this.blocks[x][y] = new FloorBlock(block.x, block.y, block.roomIDs);
            this.blocks[x][y].isBroken = true;
            // this.blocks[x][y] = new DestroyedWallBlock(block.x, block.y, block.roomIDs);
        } else if (blocktype === 'D') {
            // this.blocks[x][y] = new DestroyedDoorBlock(block.x, block.y, block.roomIDs);
            this.blocks[x][y] = new FloorBlock(block.x, block.y, block.roomIDs);
            this.blocks[x][y].isBroken = true;

        } else if (blocktype === 'F') {
            this.blocks[x][y].deleteTrap();
        }
    }

    show(player, range, players) {
        var playerX = player.x;
        var playerY = player.y;

        var roomIDs = this.getBlock(playerX, playerY).roomIDs;

        var width = 2 * range.width + 1;
        var height = 2 * range.height + 1;
        var data = Array.from(Array(width), () => Array(height));
        for (let dx = -range.width; dx <= range.width; dx++) {
            for (let dy = -range.height; dy <= range.height; dy++) {
                var block = this.getBlock(playerX + dx, playerY + dy);
                var isVisible = (block !== null) && ((roomIDs.filter(roomID => block.roomIDs.includes(roomID)).length > 0));
                data[range.width + dx][range.height + dy] = (isVisible) ? block.show(player) : null;
            }
        }
        const visiblePlayers = [];
        const allPlayers = {};
        var left = playerX - range.width;
        var right = playerX + range.width;
        var up = playerY - range.height;
        var down = playerY + range.height;
        players.forEach(eachPlayer => {
            var block = this.getBlock(eachPlayer.x, eachPlayer.y);

            allPlayers[eachPlayer.AA] =  eachPlayer.show(left, up);
            
            var validX = (left <= eachPlayer.x) && (eachPlayer.x <= right);
            var validY = (up <= eachPlayer.y) && (eachPlayer.y <= down);
            var isVisible = roomIDs.filter(roomID => block.roomIDs.includes(roomID)).length > 0;
            if (validX && validY && isVisible) {
                visiblePlayers.push(eachPlayer.AA);
            }
        });
        return {
            "map": data,
            "visiblePlayers": visiblePlayers,
            "allPlayers": allPlayers,
            "myPos": {
                x: playerX,
                y: playerY,
            },
            "myinventory":{
                "trap":player.inventory.get("trap"),
                "flash":player.inventory.get("flash"),
                "hint":player.inventory.get("hint"),
                "hammer":player.inventory.get("hammer")
            }
        }
    }
}

module.exports = MapObject;