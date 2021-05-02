import {
    BlockObject
} from './blockObject.js';

import { getAsset } from '../util/assets.js';
const COLOR = {
    'ME': 'rgba(0,0,255,1)',
    'PLAYER': 'rgba(246, 213, 92, 1)',
    'PLAYER_MINIMAP': 'rgba(255, 0, 0, 1)',
    'F': 'rgba(255, 255, 255, 1)',
    'W': 'rgba(0, 0, 0, 1)',
    'D': 'rgba(255, 255, 255, 1)',
    'P': 'rgba(255, 255, 255, 1)',
    'G': 'rgba(121, 174, 60, 1)',
    'N': 'rgba(30, 30, 30, 1)',
    'TRAP': 'rgba(100, 100, 100, 1)',
    'LIGHT': 'rgba(200, 200, 100, 1)',
    'INVEN': 'rgba(255, 255, 255, 1)',
    'MESSAGE': 'rgba(255, 255, 255, 1)',
};


const playerImg = {
    'default': 'brokenblock.png'

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
        this.grid = Math.min(stageWidth / (this.x + 4), stageHeight / this.y) * this.ratio;

        this.pos = {
            'x': stageWidth / 2 - this.grid * (this.x + 4) / 2,
            'y': stageHeight / 2 - this.grid * this.y / 2,
            'endx': stageWidth / 2 + this.grid * (this.x + 4) / 2,
            'endy': stageHeight / 2 + this.grid * this.y / 2,

        }
        this.miniMap = {
            'x': 1,
            'y': 2,
            'width': 118,
            'height': 119,
        }

        this.miniMap.mapData = Array.from(Array(this.miniMap.width), () => Array(this.miniMap.height).fill(null));

        this.miniMapGrid = Math.min(this.grid * 4 / this.miniMap.width, this.grid * 4 / this.miniMap.height)
        // console.log(this.miniMapGrid)
        this.miniMap.posx = this.pos.endx + -this.miniMapGrid * this.miniMap.width;
        this.miniMap.posy = this.pos.endy - this.miniMapGrid * this.miniMap.height;

    }


    updateMinimap() {

        this.ctx.strokeStyle = 'transparent';
        this.ctx.beginPath();

        for (let x = 0; x < this.x; x++) {
            for (let y = 0; y < this.y; y++) {
                if (this.mapData[x][y].type === 'N') {
                    continue;
                }
                // console.log(this.miniMap.mapData)
                this.miniMap.mapData[x - Math.floor(this.x / 2) + this.miniMap.x][y - Math.floor(this.y / 2) + this.miniMap.y] = this.mapData[x][y].type;
            }
        }
        for (let x = 0; x < this.miniMap.width; x++) {
            for (let y = 0; y < this.miniMap.height; y++) {
                this.ctx.fillStyle = (this.miniMap.mapData[x][y] === null) ? COLOR['N'] : COLOR[this.miniMap.mapData[x][y]]
                this.ctx.fillRect(this.miniMap.posx + x * this.miniMapGrid, this.miniMap.posy + y * this.miniMapGrid, this.miniMapGrid, this.miniMapGrid);
            }
        }

        for (let player of Object.values(this.allPlayers)) {
            this.ctx.beginPath()

            this.ctx.fillStyle = COLOR['PLAYER_MINIMAP'];
            var radius = this.miniMapGrid;

            var centerX = this.miniMap.posx + this.miniMapGrid * 0.5 + (player.x - Math.floor(this.x / 2) + this.miniMap.x) * this.miniMapGrid;
            var centerY = this.miniMap.posy + this.miniMapGrid * 0.5 + (player.y - Math.floor(this.y / 2) + this.miniMap.y) * this.miniMapGrid;

            this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            this.ctx.fill();
        }

        this.ctx.beginPath()
        this.ctx.fillStyle = COLOR['ME'];
        var radius = this.miniMapGrid;

        var centerX = this.miniMap.posx + this.miniMapGrid * 0.5 + (this.miniMap.x) * this.miniMapGrid;
        var centerY = this.miniMap.posy + this.miniMapGrid * 0.5 + (this.miniMap.y) * this.miniMapGrid;

        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.fill();

        this.updateinven()
    }
    updateinven() {
        var invengrid = this.grid;
        this.ctx.beginPath()
        this.ctx.fillStyle = COLOR['INVEN'];

        var invenx = this.miniMap.posx;
        var inveny = this.pos.endy - invengrid - this.miniMapGrid * this.miniMap.height;

        this.ctx.fillRect(invenx, inveny, invengrid, invengrid);
        this.ctx.fillRect(invenx + invengrid, inveny, invengrid, invengrid);
        this.ctx.fillRect(invenx + invengrid * 2, inveny, invengrid, invengrid);
        this.ctx.fillRect(invenx + invengrid * 3, inveny, invengrid, invengrid);

        this.ctx.fillStyle = 'black';
        this.ctx.font = "15px bold serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.inventory.trap, invenx + invengrid * 0.5, invengrid * 0.5 + inveny);
        this.ctx.fillText(this.inventory.flash, invenx + invengrid + invengrid * 0.5, invengrid * 0.5 + inveny);
        this.ctx.fillText(this.inventory.hammer, invenx + invengrid * 2 + invengrid * 0.5, invengrid * 0.5 + inveny);
        this.ctx.fillText(this.inventory.hint, invenx + invengrid * 3 + invengrid * 0.5, invengrid * 0.5 + inveny);
    }

    updateMessageLog(message) {
        this.ctx.beginPath();
        this.ctx.fillStyle = COLOR['MESSAGE'];

        var messagex = this.miniMap.posx;
        var messagey = this.pos.endy - 2 * this.grid - this.miniMapGrid * this.miniMap.height;

        this.ctx.fillRect(messagex, messagey, 2 * this.grid, this.grid);
        console.log(message, 'eee');

        this.ctx.fillStyle = 'black';
        this.ctx.font = "15px bold serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(message, messagex + this.grid * 0.5, this.grid * 0.5 + messagey);
    }

    updateData(data) {
        this.visiblePlayers = data.visiblePlayers;
        this.allPlayers = data.allPlayers;
        this.miniMap.x = data.myPos.x;
        this.miniMap.y = data.myPos.y;
        this.mapData = Array.from(Array(this.x), () => Array(this.y).fill(null));
        this.inventory = data.myinventory;
        for (let x = 0; x < this.x; x++) {
            for (let y = 0; y < this.y; y++) {
                var blockType = (data.map[x][y] !== null) ? data.map[x][y]['type'] : 'N';
                var light = (data.map[x][y] !== null) ? data.map[x][y]['light'] : false;
                var showTrap = (data.map[x][y] !== null) ? data.map[x][y]['showTrap'] : false;
                const block = new BlockObject(blockType, light, showTrap, this.pos.x + x * this.grid, this.pos.y + y * this.grid, this.grid);
                this.mapData[x][y] = block;

            }
        }
    }

    resize(stageWidth, stageHeight, grid) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.grid = grid * this.ratio;
        this.pos = {
            'x': stageWidth / 2 - this.grid * (this.x + 4) / 2,
            'y': stageHeight / 2 - this.grid * this.y / 2
        }

        if (this.data !== null) {
            for (let x = 0; x < this.x; x++) {
                for (let y = 0; y < this.y; y++) {
                    this.data[x][y].resize(this.pos.x + x * this.grid, this.pos.y + y * this.grid, this.grid);
                }
            }
        }

        this.pos.endx = this.stageWidth / 2 + this.grid * this.x / 2;
        this.pos.endy = this.stageHeight / 2 + this.grid * this.y / 2;
        // console.log(this.pos.endy)
        this.miniMapGrid = Math.min(this.grid * 4 / this.miniMap.width, this.grid * 4 / this.miniMap.height)
        // console.log(this.miniMapGrid)
        this.miniMap.posx = this.pos.endx + this.grid * 4 / 2 - this.miniMapGrid * this.miniMap.width;
        this.miniMap.posy = this.pos.endy - this.miniMapGrid * this.miniMap.height;
        // console.log(this.miniMap.posx)
    }

    draw() {
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

        if (this.mapData !== null) {
            for (let x = 0; x < this.x; x++) {
                for (let y = 0; y < this.y; y++) {
                    if (this.mapData[x][y].type === 'D') {
                        var isHor = true;
                        if (x == this.x - 1) {
                            if (this.mapData[x - 1][y].type === 'F' || this.mapData[x - 1][y].type === 'N') {
                                isHor = false;
                            }
                        } else {
                            if (this.mapData[x + 1][y].type === 'F' || this.mapData[x + 1][y].type === 'N') {
                                isHor = false;
                            }
                        }
                        if (Math.floor(this.x / 2) === x && Math.floor(this.y / 2) === y) {
                            isHor = !isHor
                        }
                        this.mapData[x][y].drawDoor(this.ctx, isHor);


                    } else {
                        this.mapData[x][y].draw(this.ctx);
                    }

                }
            }

        }

        this.ctx.lineJoin = "miter";
        this.ctx.lineWidth = 1.0;
        this.ctx.strokeStyle = 'transparent';
        this.ctx.fillStyle = COLOR['PLAYER'];
        this.ctx.strokeStyle = 'black';
        this.ctx.font = "20px bold serif";
        this.ctx.textAlign = "center";

        var radius = this.grid * 0.4;
        var armRadius = radius * 0.8;
        var armSize = radius * 0.3;
        var armY = -0.5;
        var armX = 0.9;

        this.visiblePlayers.forEach(playerAA => {
            var player = this.allPlayers[playerAA];
            var centerX = this.stageWidth / 2 + this.grid * (player.x - (this.x + 4) / 2 + 1 / 2);
            var centerY = this.stageHeight / 2 + this.grid * (player.y - this.y / 2 + 1 / 2);


            this.ctx.beginPath();
            // console.log(playerImg['default'],'asdklf3333j');

            // if(playerImg[playerAA] !== undefined){
            //     var pattern = this.ctx.createPattern(getAsset(playerImg[playerAA]),"repeat")
            // }
            // else{
            //     var pattern = this.ctx.createPattern(getAsset(playerImg['default']),"repeat")

            // }

            // this.ctx.strokeStyle = pattern;
            // this.ctx.beginPath();
            // this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            
            // this.ctx.stroke();

            this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.fillStyle = 'black';
            this.ctx.fillText(player.name, centerX, centerY - this.grid * 0.5);
            this.ctx.fillStyle = COLOR['PLAYER'];

            var dir = player.dir;
            var posX = centerX + dir.x * radius * 1.2;
            var posY = centerY + dir.y * radius * 1.2;

            this.ctx.beginPath();
            this.ctx.arc(posX + (armY * dir.x + armX * dir.y) * armRadius, posY + (armY * dir.y - armX * dir.x) * armRadius, armSize, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.arc(posX + (armY * dir.x - armX * dir.y) * armRadius, posY + (armY * dir.y + armX * dir.x) * armRadius, armSize, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
        });
        this.updateMinimap()
    }
}