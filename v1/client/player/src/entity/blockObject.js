import { getAsset } from '../util/assets.js';

const COLOR = {
    'F': 'rgba(23, 63, 95, 0.7)',
    'W': 'rgba(32, 99, 155, 1)',
    'D': 'rgba(237, 85, 59, 1)',
    'P': 'rgba(60, 174, 121, 1)',
    'N': 'rgba(30, 30, 30, 1)',
    'TRAP': 'rgba(100, 100, 100, 1)',
    'LIGHT': 'rgba(200, 200, 100, 1)'
};

const objectImgsname = {
    'W': 'wall1.png',
    'P': 'problem.png',
    'D': 'door.png'
}
export class BlockObject {
    constructor(type, light, showTrap, x, y, size) {
        this.type = type;
        this.light = light;
        this.showTrap = showTrap
        this.x = x; // pixelX
        this.y = y; // pixelY
        this.size = size;
        this.margin = 0.5;
        this.corner = 20;
        this.imgname = objectImgsname[type];
        if (this.light) {
            this.color = COLOR['LIGHT']
        } else {
            this.color = COLOR[this.type];
        }
    }

    

    resize(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    drawDoor(ctx,isHor) {
        var img = getAsset(this.imgname);
        ctx.beginPath();
        if(isHor){
            ctx.save();
            ctx.translate(this.x + this.size/2,this.y + this.size/2);
            ctx.rotate(Math.PI/2);
            ctx.translate(-this.x - this.size/2,-this.y -this.size/2);
            ctx.drawImage(img,this.x + this.margin, this.y + this.margin, this.size - 2 * this.margin, this.size - 2 * this.margin);
            ctx.restore();
        }
        else{    
            ctx.drawImage(img,this.x + this.margin, this.y + this.margin, this.size - 2 * this.margin, this.size - 2 * this.margin);
        }
    }

    drawImg(ctx) {
        var img = getAsset(this.imgname);
        ctx.beginPath()
        ctx.drawImage(img,this.x + this.margin, this.y + this.margin, this.size - 2 * this.margin, this.size - 2 * this.margin);
    }
    draw(ctx) {
        if(this.imgname !== undefined){
            this.drawImg(ctx)
            return
        }
        ctx.lineJoin = "round";
        ctx.lineWidth = this.corner;
        ctx.strokeStyle = 'transparent';
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + this.margin, this.y + this.margin, this.size - 2 * this.margin, this.size - 2 * this.margin);
        // ctx.fillRect(this.x + this.margin + (this.corner / 2), this.y + this.margin + (this.corner / 2),
        //     this.size - 2 * this.margin - 2 * (this.corner / 2), this.size - 2 * this.margin - 2 * (this.corner / 2));
        if (this.showTrap) {
            ctx.strokeStyle = 'transparent';
            ctx.fillStyle = COLOR['TRAP'];
            var radius = this.size * 0.4;
            var centerX = this.x + this.size * 0.5;
            var centerY = this.y + this.size * 0.5;
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    change(type) { // TODO 왜 만듬 
        this.type = type;
        this.init();
    }
}