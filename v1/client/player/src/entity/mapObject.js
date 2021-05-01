import { BlockObject } from './blockObject.js';
const COLOR = {
    'ME' : 'rgba(0,0,255,1)',
    'PLAYER': 'rgba(246, 213, 92, 1)',
    'PLAYER_MINIMAP': 'rgba(255, 0, 0, 1)',
    'F': 'rgba(255, 255, 255, 1)',
    'W': 'rgba(0, 0, 0, 1)',
    'D': 'rgba(255, 255, 255, 1)',
    'P': 'rgba(255, 255, 255, 1)',
    'N': 'rgba(30, 30, 30, 1)',
    'TRAP': 'rgba(100, 100, 100, 1)',
    'LIGHT': 'rgba(200, 200, 100, 1)'
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
            'y': stageHeight / 2 - this.grid * this.y / 2,
            'endx': stageWidth / 2 + this.grid * this.x / 2,
            'endy': stageHeight / 2 + this.grid * this.y / 2,
            
        }
        this.miniMap = {
            'x':1,
            'y':2,
            'width':118,
            'height':119,
        }
        
        this.miniMap.mapData = Array.from(Array(this.miniMap.width), () => Array(this.miniMap.height).fill(null));
        
        this.miniMapratio = 0.4;
        this.miniMapGrid = Math.min(stageWidth / this.miniMap.width, stageHeight / this.miniMap.height) * this.miniMapratio;

        this.miniMap.posx = this.pos.endx -this.miniMapGrid*this.miniMap.width;
        this.miniMap.posy = this.pos.endy -this.miniMapGrid*this.miniMap.height;
        
    }


    updateMinimap(){
        this.ctx.beginPath();
        for (let x = 0; x < this.x; x++) {
            for (let y = 0; y < this.y; y++) {
                if(this.mapData[x][y].type == 'N'){
                    continue;
                }
                // console.log(this.miniMap.mapData)
                this.miniMap.mapData[x-Math.floor(this.x/2) + this.miniMap.x][y-Math.floor(this.y/2) + this.miniMap.y] = this.mapData[x][y].type;
            }
        }

        
        for (let x = 0; x < this.miniMap.width; x++) {
            for (let y = 0; y < this.miniMap.height; y++) {
                this.ctx.strokeStyle = 'transparent';
                if(this.miniMap.mapData[x][y] == null){
                    this.ctx.fillStyle = COLOR['N']
                }
                else{
                    this.ctx.fillStyle = COLOR[this.miniMap.mapData[x][y]]
                }
                this.ctx.fillRect(this.miniMap.posx+x*this.miniMapGrid,this.miniMap.posy+ y*this.miniMapGrid,this.miniMapGrid,this.miniMapGrid);
            }
        }

        this.allPlayers.forEach(player => {
            this.ctx.beginPath()
            this.ctx.strokeStyle = 'transparent';
            this.ctx.fillStyle = COLOR['PLAYER_MINIMAP'];
            var radius = this.miniMapGrid;

            var centerX = this.miniMap.posx+ this.miniMapGrid*0.5 + (player.x-Math.floor(this.x/2) + this.miniMap.x)*this.miniMapGrid;
            var centerY = this.miniMap.posy+this.miniMapGrid*0.5 + (player.y-Math.floor(this.y/2) + this.miniMap.y)*this.miniMapGrid;
            
            this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            this.ctx.fill();
        });

        this.ctx.beginPath()
        this.ctx.strokeStyle = 'transparent';
        this.ctx.fillStyle = COLOR['ME'];
        var radius = this.miniMapGrid;

        var centerX = this.miniMap.posx+this.miniMapGrid*0.5 + (this.miniMap.x)*this.miniMapGrid;
        var centerY = this.miniMap.posy+this.miniMapGrid*0.5 + (this.miniMap.y)*this.miniMapGrid;
        
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    updateData(data) {
        this.players = data.players;
        this.allPlayers = data.allPlayers;
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
        
        
        this.updateMinimap()
    }
    
    coordinate(x, y) { // TODO ????? 왜 만듬
        return {
            'x': this.pos.x + x * this.grid,
            'y': this.pos.y + y * this.grid
        }
    }
    
}