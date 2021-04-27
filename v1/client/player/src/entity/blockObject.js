export class BlockObject {
    constructor(type, x, y, size) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
        
        this.margin = 0;

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
            case 'F':
                this.color = 'rgba(255, 255, 255, 0)';
                this.pass = false;
                break;
            case 'W':
                this.color = 'rgba(0, 120, 255, 0.6)';
                break;
            case 'D':
                this.color = 'rgba(0, 0, 0, 0.8)';
                this.pass = false;
                break;
            case 'P':
                this.color = 'rgba(255, 60, 0, 0.7)';
                this.pass = false;
                break;
            default:
                alert('No matched block type for '+this.type.toString())
        }
    }
}