import { BlockObject } from './blockObject.js'

export class MapObject {
    constructor(width, height, data) {
        this.width = width;
        this.height = height;

        this.data = null;
        if (data !== undefined) {
            data.then(function(resolvedData) {
                this.initData(resolvedData);
            }.bind(this));
        } else {
            this.initData(null);
        }


        this.ratio = 0.8
        this.grid = Math.min(stageWidth / this.x, stageHeight / this.y) * this.ratio
        this.pos = {
            'x': stageWidth / 2 - this.grid * this.x / 2,
            'y': stageHeight / 2 - this.grid * this.y / 2
        }
    }

    initData(blueprint) {
        if (blueprint === null || blueprint === '') {
            const data = new Array(this.x);
            for (var x = 0; x < this.x; x++) {
                data[x] = new Array(this.y);
                for (var y = 0; y < this.y; y++) {
                    const block = new BlockObject(
                        'ground',
                        this.x + x * this.size,
                        this.y + y * this.size,
                        this.size
                    );
                    data[x][y] = block;
                }
            }
            this.data = data

        } else {
            blueprint = blueprint.split('\n');

            this.x = Math.max(...blueprint.map(el => el.trim().length));
            this.y = blueprint.length;
            for (var i = 0; i < this.y; i++) {
                blueprint[i] = blueprint[i].trim();
                blueprint[i] += 'W'.repeat(this.x - blueprint[i].length);
            }

            const data = new Array(this.x);
            for (var x = 0; x < this.x; x++) {
                data[x] = new Array(this.y);
                for (var y = 0; y < this.y; y++) {
                    const block = new BlockObject(
                        blueprint[y][x],
                        this.x + x * this.size,
                        this.y + y * this.size,
                        this.size
                    );
                    data[x][y] = block;
                }
            }
            this.data = data
        }

    }

    getBlock(x, y) {
        return (0 <= x < this.width && 0 <= y < this.height) ? this.data[x][y] : null
    }

    coordinate(x, y) {
        return {
            'x': this.pos.x + x * this.grid,
            'y': this.pos.y + y * this.grid
        }
    }

    show(playerX, playerY, range) {
        const data = new Array(2 * range.width + 1);
        for (var x = playerX - range.width; x < playerX + range.width; x++) {
            data[x] = new Array(2 * range.height + 1);
            for (var y = playerY - range.height; y < playerY + range.height; y++) {
                const block = this.getBlock(x, y);
                const block = new BlockObject(
                    'ground',
                    this.x + x * this.size,
                    this.y + y * this.size,
                    this.size
                );
                data[x][y] = block;
            }
        }
        this.data = data
        return data
    }

    moveCheck(player,x,y) {
        return this.data[x][y].canPass(player);
    }

    activate(player,x,y) {

    }

}