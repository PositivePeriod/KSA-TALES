import { BlockObject } from './blockObject.js';
const COLOR = {
    'PLAYER': 'rgba(246, 213, 92, 1)'
};



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

        this.miniMap = {
            'x':1,
            'y':2,
            'width':118,
            'height':119,
        }
        
        this.miniMapratio = 0.2;
        this.miniMapGrid = Math.min(stageWidth / this.miniMap.width, stageHeight / this.miniMap.height) * this.ratio;

        this.miniMap.data = Array.from(Array(this.miniMap.x), () => Array(this.miniMap.y).fill(null));
    }


    updateMinimap(){
        // console.log(this.miniMapGrid,this.ctx,'affsdsdjlsdlsdllh');
        // console.log((this.miniMap.x)*this.miniMapGrid, (this.miniMap.y)*this.miniMapGrid);
        // console.log(this.x,this.y);
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'transparent';
        this.ctx.fillStyle = 'rgba(32, 99, 155, 1)';
        this.ctx.fillRect(0,0,50,50);
        for (let x = 0; x < this.x; x++) {
            for (let y = 0; y < this.y; y++) {
                if(this.mapData[x][y].type == 'N'){
                    continue;
                }
                this.ctx.fillRect((x+this.miniMap.x)*this.miniMapGrid, (y+this.miniMap.y)*this.miniMapGrid,this.miniMapGrid,this.miniMapGrid);
            }
        }
    }

    updateData(data) {
        this.players = data.players;
        this.miniMap.x = data.myPos.x;
        this.miniMap.y = data.myPos.y;
        this.mapData = Array.from(Array(this.x), () => Array(this.y).fill(null));
        for (let x = 0; x < this.x; x++) {
            for (let y = 0; y < this.y; y++) {
                var blockType = (data.map[x][y] !== null) ? data.map[x][y]['type'] : 'N';
                var light = (data.map[x][y] !== null) ? data.map[x][y]['light'] : false;
                var showTrap = (data.map[x][y] !== null) ? data.map[x][y]['showTrap'] : false;
                const block = new BlockObject(blockType, light, showTrap, this.pos.x + x * this.grid,this.pos.y + y * this.grid, this.grid);
                this.mapData[x][y] = block;
            }
        }
        // this.updateMinimap()
    }

    resize(stageWidth, stageHeight, grid) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.grid = grid * this.ratio;
        this.pos = {
            'x': stageWidth / 2 - this.grid * this.x / 2,
            'y': stageHeight / 2 - this.grid * this.y / 2
        }

        if (this.data !== null) {
            for (let x = 0; x < this.x; x++) {
                for (let y = 0; y < this.y; y++) {
                    this.data[x][y].resize(this.pos.x + x * this.grid, this.pos.y + y * this.grid, this.grid);
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        if (this.mapData !== null) {
            for (let x = 0; x < this.x; x++) {
                for (let y = 0; y < this.y; y++) {
                    if(this.mapData[x][y].type == 'D'){
                        var isHor = true;
                        if(x==this.x-1){
                            if(this.mapData[x-1][y].type == 'F' || this.mapData[x-1][y].type == 'N'){
                                isHor = false;
                            }
                        }
                        else{
                            if(this.mapData[x+1][y].type == 'F' || this.mapData[x+1][y].type == 'N'){
                                isHor = false;
                            }
                        }
                        if(Math.floor(this.x/2) == x && Math.floor(this.y/2) == y){
                            isHor = !isHor
                        }
                        this.mapData[x][y].drawDoor(this.ctx,isHor);


                    }
                    else{
                        this.mapData[x][y].draw(this.ctx);
                    }
                    
                }
            }

        }
        this.players.forEach(player => {
            this.ctx.lineJoin = "miter";
            this.ctx.lineWidth = 1.0;
            this.ctx.strokeStyle = 'transparent';
            this.ctx.fillStyle = COLOR['PLAYER'];
            var radius = this.grid * 0.4;
            var centerX = this.grid*0.5 + this.grid * player.x + this.stageWidth / 2 - this.grid * this.x / 2;
            var centerY = this.grid*0.5 + this.grid * player.y + this.stageHeight / 2 - this.grid * this.y / 2;
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