//엥 이거 전에 바꿨던 거 같은데..
// Blockobject.type : {'Floor' : 바닥, 'Wall' : 벽, '}
export class BlockObject {
    constructor(type, x, y, size) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;

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
            case 'Floor':
            case 'F':
                this.color = 'rgba(255, 255, 255, 0)';
                this.pass = false;
                break;
            case 'Wall':
            case 'W':
                this.color = 'rgba(0, 120, 255, 0.6)';
                break;
            case 'Door':
            case 'D':
                this.color = 'rgba(0, 0, 0, 0.8)';
                this.pass = false;
                break;
            case 'Q':
                this.color = 'rgba(255, 60, 0, 0.7)';
                this.pass = false;
                break;
            default:
                alert('No matched block type for '+this.type.toString())
        }
    }
}