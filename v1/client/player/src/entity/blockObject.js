const COLOR = {
    'F': 'rgba(23, 63, 95, 0.7)',
    'W': 'rgba(32, 99, 155, 1)',
    'D': 'rgba(237, 85, 59, 1)',
    'P': 'rgba(60, 174, 121, 1)',
    'N': 'rgba(0, 0, 0, 1)',
    'PLAYER': 'rgba(246, 213, 92, 1)'
};

export class BlockObject {
    constructor(type, x, y, size) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
        this.margin = 0.5;
        this.color = COLOR[this.type];
    }

    resize(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    draw(ctx) {
        ctx.strokeStyle = 'transparent';
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + this.margin, this.y + this.margin, this.size - 2 * this.margin, this.size - 2 * this.margin);
    }

    drawPlayer(ctx) {
        ctx.strokeStyle = 'transparent';
        ctx.fillStyle = COLOR['PLAYER'];
        var radius = this.size * 0.4;
        var centerX = this.x + this.size * 0.5;
        var centerY = this.y + this.size * 0.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    change(type) { // TODO 왜 만듬 
        this.type = type;
        this.init();
    }
}