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
        this.x = x; // pixelX
        this.y = y; // pixelY
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

    change(type) { // TODO 왜 만듬 
        this.type = type;
        this.init();
    }
}