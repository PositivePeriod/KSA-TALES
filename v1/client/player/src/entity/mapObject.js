import { BlockObject } from './blockObject.js';

export class MapObject {
    constructor(stageWidth, stageHeight, x, y, ctx) {
        this.x = x; // 가로 칸 개수
        this.y = y; // 세로 칸 개수
        this.ctx = ctx;

        this.data = null;
        // if (data !== undefined) {
        //     data.then(function(resolvedData) {
        //         this.initData(resolvedData);
        //     }.bind(this));
        // } else {
        //     this.initData(null);
        // }

        this.ratio = 0.8
        this.grid = Math.min(stageWidth / this.x, stageHeight / this.y) * this.ratio
        this.pos = {
            'x': stageWidth / 2 - this.grid * this.x / 2,
            'y': stageHeight / 2 - this.grid * this.y / 2
        }
    }

    initData(blueprint) {
        // if (blueprint === null || blueprint === '') {
        //     const data = new Array(this.x);
        //     for (var x = 0; x < this.x; x++) {
        //         data[x] = new Array(this.y);
        //         for (var y = 0; y < this.y; y++) {
        //             const block = new Block(
        //                 'ground',
        //                 this.x + x * this.size,
        //                 this.y + y * this.size,
        //                 this.size 
        //             );
        //             data[x][y] = block;
        //         }
        //     }
        //     this.data = data

        // } else {
        //     blueprint = blueprint.split('\n');

        //     this.x = Math.max(...blueprint.map(el => el.trim().length));
        //     this.y = blueprint.length;
        //     for (var i = 0; i < this.y; i++) {
        //         blueprint[i] = blueprint[i].trim();
        //         blueprint[i] += 'E'.repeat(this.x - blueprint[i].length);
        //     }

        //     const data = new Array(this.x);
        //     for (var x = 0; x < this.x; x++) {
        //         data[x] = new Array(this.y);
        //         for (var y = 0; y < this.y; y++) {
        //             const block = new Block(
        //                 blueprint[y][x],
        //                 this.x + x * this.size,
        //                 this.y + y * this.size,
        //                 this.size
        //             );
        //             data[x][y] = block;
        //         }
        //     }
        //     this.data = data
        // }

    }

    updateData(newData) {
        const data = Array.from(Array(this.x), () => Array(this.y).fill(null));

        for (var x = 0; x < this.x; x++) {
            for (var y = 0; y < this.y; y++) {
                if (newData[x][y] !== null) {
                    const block = new BlockObject(
                        newData[x][y]['type'],
                        this.x + x * this.size,
                        this.y + y * this.size,
                        this.size
                    );
                    data[x][y] = block;
                }
            }
        }
        this.data = data
    }

    resize(stageWidth, stageHeight) {
        this.grid = Math.min(stageWidth / this.x, stageHeight / this.y) * this.ratio
        this.pos.x = stageWidth / 2 - this.grid * this.x / 2;
        this.pos.y = stageHeight / 2 - this.grid * this.y / 2;

        if (this.data !== null) {
            for (var x = 0; x < this.x; x++) {
                for (var y = 0; y < this.y; y++) {
                    if (this.data[x][y] !== null) {
                        this.data[x][y].resize(this.pos.x + x * this.grid, this.pos.y + y * this.grid, this.grid);
                    }
                }
            }
        }
    }

    draw() {
        console.log('draw');
        if (this.data !== null) {
            for (var x = 0; x < this.x; x++) {
                for (var y = 0; y < this.y; y++) {
                    if (this.data[x][y] !== null) {
                        console.log(this.data, x, y, this.data[x][y]);
                        this.data[x][y].draw(this.ctx);
                    }
                }
            }
        }
    }

    coordinate(x, y) { // TODO ????? 왜 만듬
        return {
            'x': this.pos.x + x * this.grid,
            'y': this.pos.y + y * this.grid
        }
    }
}