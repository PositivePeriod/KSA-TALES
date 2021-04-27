import { Block } from './block.js';

export class MapObject {
    constructor(stageWidth, stageHeight, x, y, data) {
        this.x = x;
        this.y = y;

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
                    const block = new Block(
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
                blueprint[i] += 'E'.repeat(this.x - blueprint[i].length);
            }

            const data = new Array(this.x);
            for (var x = 0; x < this.x; x++) {
                data[x] = new Array(this.y);
                for (var y = 0; y < this.y; y++) {
                    const block = new Block(
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
    
    updateData(blueprint){
            const data = new Array(this.x);
            for (var x = 0; x < this.x; x++) {
                data[x] = new Array(this.y);
                for (var y = 0; y < this.y; y++) {
                    const block = new Block(
                        blueprint[y][x]['type'],
                        this.x + x * this.size,
                        this.y + y * this.size,
                        this.size
                    );
                    data[x][y] = block;
                }
            }
            this.data = data
    }

    resize(stageWidth, stageHeight) {
        this.grid = Math.min(stageWidth / this.x, stageHeight / this.y) * this.ratio
        this.pos.x = stageWidth / 2 - this.grid * this.x / 2;
        this.pos.y = stageHeight / 2 - this.grid * this.y / 2;

        if (this.data != null) {
            for (var x = 0; x < this.x; x++) {
                for (var y = 0; y < this.y; y++) {
                    this.data[x][y].resize(this.pos.x + x * this.grid, this.pos.y + y * this.grid, this.grid);
                }
            }
        }
    }

    draw(ctx) {
        console.log('draw');
        if (this.data != null) {
            for (var x = 0; x < this.x; x++) {
                for (var y = 0; y < this.y; y++) {
                    this.data[x][y].draw(ctx);
                }
            }
        }
    }

    coordinate(x, y) {
        return {
            'x': this.pos.x + x * this.grid,
            'y': this.pos.y + y * this.grid
        }
    }
}