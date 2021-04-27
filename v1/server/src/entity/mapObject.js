const { DoorBlock, FloorBlock, ProblemBlock, WallBlock } = require('./blockObject.js');

class MapObject {
    constructor(data) {
        this.width = data.width;
        this.height = data.height;

        this.blocks = Array.from(Array(this.width), () => Array(this.height));
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var blockData = data.map[y][x]
                var blockType = blockData.slice(0, 1);
                switch (blockType) {
                    case 'W':
                        var block = new WallBlock('W', x, y);
                        break;
                    case 'D':
                        var problemIDs = data.door[blockData]
                        var block = new DoorBlock('D', x, y, problemIDs);
                        break;
                    case 'P':
                        var problemData = data.problem[blockData];
                        var id = problemData["id"];
                        var reward = problemData["reward"];
                        var block = new ProblemBlock('P', x, y, id, reward);
                        break;
                    case 'S':
                        this.startPos = { "x": x, "y": y };
                    case 'F':
                        var block = new FloorBlock('F', x, y);
                        break;
                }
                this.blocks[x][y] = block;
            }
        }
    }


    getBlock(x, y) {
        return (0 <= x && x < this.width && 0 <= y && y < this.height) ? this.blocks[x][y] : null;
    }

    show(player, range) {
        var playerX = player.x;
        var playerY = player.y;

        var width = 2 * range.width + 1;
        var height = 2 * range.height + 1;
        const data = Array.from(Array(width), () => Array(height));

        for (var dx = -range.width; dx <= range.width; dx++) {
            for (var dy = -range.height; dy <= range.height; dy++) {
                const block = this.getBlock(playerX + dx, playerY + dy);
                data[range.width+dx][range.height+dy] = block !== null ? block.show() : null;
            }
        }
        return data
    }
}

module.exports = MapObject;