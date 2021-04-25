export class Player {
    constructor(x, y, map) {
        this.x = x;
        this.y = y;
        this.map = map;

        this.size = this.map.grid;
        this.margin = 8;
        this.color = 'rgba(0, 120, 255, 0.6)';
    }

    resize() {
        this.size = this.map.grid;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        var pos = this.map.coordinate(this.x, this.y);
        ctx.fillRect(pos.x + this.margin, pos.y + this.margin, this.size - 2 * this.margin, this.size - 2 * this.margin);
    }

    move(direction) {
        var x = this.x + direction[0]
        var y = this.y + direction[1]
        if ((0 <= x && x < this.map.x) && (0 <= y && y < this.map.y)) {
            if (this.map.data[x][y].pass) {
                this.x = x;
                this.y = y;
            }
        }
    }
}