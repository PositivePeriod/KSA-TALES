export class PlayerObject {
    constructor(x, y, profile, map) {
        this.x = x;
        this.y = y;
        this.dir = 'w';
        this.solved = [];
        this.inventory = [];
        this.profile = profile
        this.map = map
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        return this.x, this.y
    }

    rotate(dir) {
        this.dir = dir;
    }

    hasSolved(qid) {
        this.solved.push(qid);
    }

    appenditem(item) {
        this.inventory.push(item);
    }

    useitem(idx) {
        var item = this.inventory[idx];
        this.inventory.splice(idx, 1)
        item.activate();
    }

}s