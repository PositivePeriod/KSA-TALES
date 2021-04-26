export class PlayerObject {
    constructor(x, y, color, map) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.dir = 'up'
        this.solved = [];
        this.inventory = [];
        this.map = map
    }

    move(keyInput) {
        switch (keyInput) {
            case 'KeyD':
                var next = this.map.data[this.x+1][this.y];
                if (next.pass) {
                    this.x += 1
                    this.dir = 'right'
                }
            case 'KeyD':
                var next = this.map.data[this.x-1][this.y];
                if (next.pass) {
                    this.x -= 1
                    this.dir = 'left'
                }
            case 'KeyW':
                var next = this.map.data[this.x][this.y+1];
                if (next.pass) {
                    this.y += 1
                    this.dir = 'up'
                }
            case 'KeyS':
                var next = this.map.data[this.x][this.y-1];
                if (next.pass) {
                    this.y -= 1
                    this.dir = 'down'
                }
            case 'KeyF':
                var adjs = [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]];
                for (var [dx, dy] of adjs) {
                    var adj = this.data[this.x+dx][this.y+dy];
                    if (adj.type == 'Q') {
                        qid = adj.id
                        this.solve(adj)
                    }
                }

        }
        return x, y;
    }

    solve(qid) {
        var question = questions[qid];
        // load question
    }

    useitem(idx) {
        var item = inventory[idx];
    }

}s