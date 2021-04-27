export class Block {
    constructor(type, x, y, size) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;

        this.margin = 2;
        this.pass = true;
        this.color = 'rgba(0, 0, 0, 0.4)';
        this.init();
    }

    resize(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + this.margin, this.y + this.margin, this.size - 2 * this.margin, this.size - 2 * this.margin);
    }

    change(type) {
        this.type = type;
        this.init();
    }

    init() {
        switch (this.type){
            case ' ':
            case 'E':
            case 'empty':
                this.color = 'rgba(255, 255, 255, 0)';
                this.pass = false;
                break;
            case 'W':
            case 'water':
                this.color = 'rgba(0, 120, 255, 0.6)';
                break;
            case 'B':
            case 'barrier':
                this.color = 'rgba(0, 0, 0, 0.8)';
                this.pass = false;
                break;
            case 'L':
            case 'lava':
                this.color = 'rgba(255, 60, 0, 0.7)';
                this.pass = false;
                break;
            case 'G':
            case 'ground':
                break;
            default:
                alert('No matched block type for '+this.type.toString())
        }
    }
}