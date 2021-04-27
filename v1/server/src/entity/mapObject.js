import { BlockObject } from './blockObject.js';

export class MapObject {
    constructor(data) {
        this.width = data.width;
        this.height = data.height;

        this.blocks = Array.from(Array(this.width), () => Array(this.height));
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.y; y++) {
                var blockType = data.map[x][y].slice(0, 1);
                switch (blockType) {
                    case 'W':
                    case 'D':
                    case 'P':
                    case 'S':
                        this.startX = x;
                        this.startY = y;
                    case 'F':
                }
                const block = new BlockObject(
                    data.map[x][y],
                    this.x + x * this.size,
                    this.y + y * this.size,
                    this.size
                );
                this.blocks[x][y] = block;
            }
        }
        this.blocks = data
    }


    getBlock(x, y) {
        return (0 <= x < this.width && 0 <= y < this.height) ? this.blocks[x][y] : null
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
                data[x][y] = block !== null ? block.show() : null;
            }
        }
        player.usingFlash = false
        return data
    }
}