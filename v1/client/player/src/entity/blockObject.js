import { getAsset } from './assets.js';

const COLOR = {
    'F': 'rgba(23, 63, 95, 0.7)',
    'W': 'rgba(32, 99, 155, 1)',
    'D': 'rgba(237, 85, 59, 1)',
    'P': 'rgba(60, 174, 121, 1)',
    'N': 'rgba(30, 30, 30, 1)',
    'TRAP': 'rgba(100, 100, 100, 1)',
    'LIGHT': 'rgba(200, 200, 100, 1)'
};

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



    drawImg(ctx) {
        var img = new Image();
        img.src = "../path.png";


        var ctx = document.getElementById('canvas').getContext('2d');
        ctx.drawImage(img, 8, 8);
    }
    draw(ctx) {
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