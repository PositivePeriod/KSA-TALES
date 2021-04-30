import { BlockObject } from './blockObject.js';
const COLOR = {
    'PLAYER': 'rgba(246, 213, 92, 1)'
};

const objectImgs = {
    'W': 'Wall1',
}

export class MapObject {
    constructor(stageWidth, stageHeight, x, y, ctx) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.x = x; // 가로 칸 개수
        this.y = y; // 세로 칸 개수
        this.ctx = ctx;

        this.data = null;
        this.ratio = 0.8;
        this.grid = Math.min(stageWidth / this.x, stageHeight / this.y) * this.ratio;
        this.pos = {
            'x': stageWidth / 2 - this.grid * this.x / 2,
            'y': stageHeight / 2 - this.grid * this.y / 2
        }
    }



    updateData(data) {
        this.players = data.players;
        this.mapData = Array.from(Array(this.x), () => Array(this.y).fill(null));
        for (let x = 0; x < this.x; x++) {
            for (let y = 0; y < this.y; y++) {
                var blockType = (data.map[x][y] !== null) ? data.map[x][y]['type'] : 'N';
                var light = (data.map[x][y] !== null) ? data.map[x][y]['light'] : false;
                var showTrap = (data.map[x][y] !== null) ? data.map[x][y]['showTrap'] : false;
                const block = new BlockObject(blockType, light, showTrap, this.x + x * this.grid, this.y + y * this.grid, this.grid);
                this.mapData[x][y] = block;
            }
        }
    }

    resize(stageWidth, stageHeight, grid) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.grid = grid * this.ratio;
        this.pos.x = stageWidth / 2 - this.grid * this.x / 2;
        this.pos.y = stageHeight / 2 - this.grid * this.y / 2;

        if (this.data !== null) {
            for (let x = 0; x < this.x; x++) {
                for (let y = 0; y < this.y; y++) {
                    this.data[x][y].resize(this.pos.x + x * this.grid, this.pos.y + y * this.grid, this.grid);
                }
            }
        }
    }

    getProblem(problemID) {
        console.log(problemID);
        const asset = new Image();
        asset.src = `http://localhost:8000/assets/${problemID}.png`;
        asset.onload = () => {
            var problem = document.getElementById('problem');
            while (problem.firstChild) {
                problem.removeChild(problem.lastChild);
            }
            problem.appendChild(asset);
            problem.classList.remove('invisible');
            problem.classList.add('visible');
            // this.socket.emit(MSG.SEND_PROBLEM, data);
        };

    }


    draw() {
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        if (this.mapData !== null) {
            for (let x = 0; x < this.x; x++) {
                for (let y = 0; y < this.y; y++) {
                    this.mapData[x][y].draw(this.ctx);
                }
            }

        }
        this.players.forEach(player => {
            this.ctx.lineJoin = "miter";
            this.ctx.lineWidth = 1.0;
            this.ctx.strokeStyle = 'transparent';
            this.ctx.fillStyle = COLOR['PLAYER'];
            var radius = this.grid * 0.4;
            var centerX = this.x + this.grid * player.x + this.grid * 0.5;
            var centerY = this.y + this.grid * player.y + this.grid * 0.5;
            this.ctx.beginPath()
            this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }

    coordinate(x, y) { // TODO ????? 왜 만듬
        return {
            'x': this.pos.x + x * this.grid,
            'y': this.pos.y + y * this.grid
        }
    }
}