const { DoorBlock, FloorBlock, ProblemBlock, WallBlock } = require('./blockObject.js');

const mapNumber = 2;
const mapData = require(`../../data/mapData${mapNumber}.json`);

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
                var blockType = blockData.slice(0, 1);
                switch (blockType) {
                    case 'W':
                        var block = new WallBlock(x, y, roomIDs);
                        break;
                    case 'D':
                        var problemIDs = mapData.door[blockData]
                        var block = new DoorBlock(x, y, roomIDs, problemIDs);
                        break;
                    case 'P':
                        var problemData = mapData.problem[blockData];
                        var id = problemData["id"];
                        var answer = problemData["answer"];
                        var reward = problemData["reward"];
                        var block = new ProblemBlock(x, y, roomIDs, id, answer, reward); // TODO
                        break;
                    case 'S':
                        this.startPos = { "x": x, "y": y };
                    case 'F':
                        var block = new FloorBlock(x, y, roomIDs);
                        break;
                }
                this.blocks[x][y] = block;
            }
        }
    }

    getBlock(x, y) {
        return (0 <= x && x < this.width && 0 <= y && y < this.height) ? this.blocks[x][y] : null;
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
        const visiblePlayer = [];
        players.forEach(player => {
            var validX = (playerX - range.width <= player.x) && (player.x <= playerX + range.width);
            var validY = (playerY - range.height <= player.y) && (player.y <= playerY + range.height);
            var block = this.getBlock(player.x, player.y);
            var isVisible = roomIDs.filter(roomID => block.roomIDs.includes(roomID)).length > 0;
            if (validX && validY && isVisible) {
                visiblePlayer.push({
                    "x": player.x - (playerX - range.width),
                    "y": player.y - (playerY - range.height)
                })
            }
        });

        return {
            "map": data,
            "players": visiblePlayer
        }
    }
}

module.exports = MapObject;