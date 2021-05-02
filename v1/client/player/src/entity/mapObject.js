import {
    BlockObject
} from './blockObject.js';

import { getAsset } from '../util/assets.js';
const COLOR = {
    'ME': 'rgba(0,0,255,1)',
    'PLAYER': 'rgba(255, 255, 255, 1)',
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
    'LEADERBOARD': 'rgba(0, 0, 0, 1)',
};


const playerImg = {
    'RAA-4' : 'AA/RAA_4.png',
    'RAA-2' :'AA/RAA_2.png',
    'RAA-1' :'AA/RAA_1.png',
    'AA3-9' :'AA/AA3_9.png',
    'AA3-8' :'AA/AA3_8.png',
    'AA3-6' :'AA/AA3_6.png',
    'AA3-5' :'AA/AA3_5.png',
    'AA3-4' :'AA/AA3_4.png',
    'AA3-2' :'AA/AA3_2.png',
    'AA3-1' :'AA/AA3_1.png',
    'AA2-9' :'AA/AA2_9.png',
    'AA2-8' :'AA/AA2_8.png',
    'AA2-7' :'AA/AA2_7.png',
    'AA2-6' :'AA/AA2_6.png',
    'AA2-4' :'AA/AA2_4.png',
    'AA2-3' :'AA/AA2_3.png',
    'AA2-2' :'AA/AA2_2.png',
    'AA2-1' :'AA/AA2_1.png',
    'AA1-10' :'AA/AA1_10.png',
    'AA1-8' :'AA/AA1_8.png',
    'AA1-9' :'AA/AA1_9.png',
    'AA1-7' :'AA/AA1_7.png',
    'AA1-5' :'AA/AA1_5.png',
    'AA1-4' :'AA/AA1_4.png',
    'AA1-1' :'AA/AA1_1.png',
    'default' :'AA/default.png'

};

const playerLeaderboardCoord = {
    'AA1-1' : [0, 0.15],
    'AA1-2' : [0, 0.3],
    'AA1-3' : [0, 0.45],
    'AA1-4' : [0, 0.6],
    'AA1-5' : [0, 0.75],
    'AA1-6' : [0, 0.9],
    'AA1-7' : [0, 1.05],
    'AA1-8' : [0, 1.2],
    'AA1-9' : [0, 1.35],
    'AA1-10' : [0, 1.5],
    'AA2-1' : [1.3, 1.65],
    'AA2-2' : [1.3, 1.8],
    'AA2-3' : [1.3, 1.95],
    'AA2-4' : [1.3, 0.15],
    'AA2-5' : [1.3, 0.3],
    'AA2-6' : [1.3, 0.45],
    'AA2-7' : [1.3, 0.6],
    'AA2-8' : [1.3, 0.75],
    'AA2-9' : [1.3, 0.9],
    'AA3-1' : [1.3, 1.05],
    'AA3-2' : [1.3, 1.2],
    'AA3-3' : [1,3, 1.35],
    'AA3-4' : [1.3, 1.5],
    'AA3-5' : [1.3, 1.65],
    'AA3-6' : [1.3, 1.8],
    'AA3-7' : [1.3, 1.95],
    'AA3-8' : [2.6, 1.65],
    'AA3-9' : [2.6, 1.8],
    'RAA-1' : [2.6, 1.95],
    'RAA-2' : [2.6, 0.15],
    'RAA-3' : [2.6, 0.3],
    'RAA-4' : [2.6, 0.45],
    'RAA-5' : [2.6, 0.6],

};


export class MapObject {
    constructor(stageWidth, stageHeight, x, y, ctx) {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.x = x; // 가로 칸 개수

        this.y = y; // 세로 칸 개수
        this.ctx = ctx;
        this.leaderboard = {};

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
        var cnt = 0;

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

        this.updateInven();
        this.updateLeaderboard();
    }

    updateInven() {
        var invengrid = this.grid;
        this.ctx.beginPath()
        this.ctx.fillStyle = COLOR['INVEN'];

        var invenx = this.miniMap.posx;
        var inveny = this.pos.endy - invengrid - this.miniMapGrid * this.miniMap.height;

        this.ctx.fillRect(invenx, inveny, invengrid, invengrid);
        this.ctx.fillRect(invenx + invengrid, inveny, invengrid, invengrid);
        this.ctx.fillRect(invenx + invengrid * 2, inveny, invengrid, invengrid);
        this.ctx.fillRect(invenx + invengrid * 3, inveny, invengrid, invengrid);

        
        // console.log(getAsset('trap.png'))
        this.ctx.drawImage(getAsset('trap.png'),invenx, inveny, invengrid, invengrid*0.75);
        this.ctx.drawImage(getAsset('flash.png'),invenx + invengrid, inveny, invengrid, invengrid*0.75);
        this.ctx.drawImage(getAsset('hammer.png'),invenx + invengrid * 2, inveny, invengrid, invengrid*0.75);
        this.ctx.drawImage(getAsset('hint.png'),invenx + invengrid * 3, inveny, invengrid, invengrid*0.75);

        this.ctx.fillStyle = 'black';

        this.ctx.font = toString(Math.floor(invengrid/5))+"px bold serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.inventory.trap, invenx + invengrid * 0.5, invengrid  + inveny);
        this.ctx.fillText(this.inventory.flash, invenx + invengrid + invengrid * 0.5, invengrid  + inveny);
        this.ctx.fillText(this.inventory.hammer, invenx + invengrid * 2 + invengrid * 0.5, invengrid  + inveny);
        this.ctx.fillText(this.inventory.hint, invenx + invengrid * 3 + invengrid * 0.5, invengrid + inveny);
    }

    updateLeaderboard() {
        this.ctx.beginPath();
        this.ctx.fillStyle = COLOR['LEADERBOARD'];

        var boardx = this.miniMap.posx;
        var boardy = this.pos.endy - 3 * this.grid - this.miniMapGrid * this.miniMap.height;

        this.ctx.fillRect(boardx, boardy, 4 * this.grid, 2*this.grid);

        this.ctx.fillStyle = 'white';
        this.ctx.font = "12px bold serif";
        this.ctx.textAlign = "left";
        if (Object.keys(playerLeaderboardCoord).length == 0) {return; }
        for (const [player, coord] of Object.entries(playerLeaderboardCoord)) {
            var name = this.leaderboard[player].name;
            var progress = this.leaderboard[player].progress;
            this.ctx.fillText(name + ": " + String(progress) + "%", boardx + this.grid * coord[0], boardy + this.grid * coord[1]);
        }
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

            if(playerImg[playerAA] !== undefined){
                var img = getAsset(playerImg[playerAA])
            }
            else{
                var img = getAsset(playerImg['default'])
            }

            // this.ctx.strokeStyle = pattern;
            // this.ctx.beginPath();
            // this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            
            // this.ctx.stroke();

            
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.clip();

            this.ctx.drawImage(img,centerX-radius, centerY-radius,radius*2, radius*2);

            this.ctx.beginPath();
            this.ctx.arc(centerX-radius, centerY-radius, radius*2, 0, Math.PI * 2, true);
            this.ctx.clip();
            this.ctx.closePath();
            this.ctx.restore();
            
            this.ctx.fillStyle = 'black';


            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            // this.ctx.fill();
            this.ctx.stroke();


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