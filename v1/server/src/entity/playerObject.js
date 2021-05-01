const InputDeque = require("../util/deque");
const {
    WallBlock,
    DoorBlock,
    FloorBlock,
    ProblemBlock
} = require("./blockObject");

// TODO / define const Flash area of player
const FlashArea = [
    [1, 1],
    [1, 0],
    [1, -1],
    [2, 2],
    [2, 1],
    [2, 0],
    [2, -1],
    [2, -2]
];
const isEqual = (first, second) => {
    return JSON.stringify(first) === JSON.stringify(second);
}

class PlayerObject {
    constructor(socketID, AA, name, x, y,map) {
        this.socketID = socketID;
        this.AA = AA;
        this.name = name;
        this.x = x;
        this.y = y;
        this.map = map;

        this.key = ["K1"];
        this.trap = 100;
        this.flash = 100;
        this.hint = 1;
        this.trapdeleter = 100;

        this.commandQueue = new InputDeque();
        this.dir = {
            x: 0,
            y: -1
        };
        this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        this.canMove = true;
        this.usingFlash = false;
    }

    show() {
        return {
            'name': this.name,
            'AA': this.AA,
            'color': this.color,
            'x': this.x,
            'y': this.y,
            'dir': this.dir
        }
    }

    solve(problemID, rewards) {
        this.solvedProblemIDs.push(problemID)
        for (reward of rewards) {
            switch (reward.charAt(0)) {
                case 'T':
                    this.trap++;
                case 'F':
                    this.flash++;
                case 'H':
                    this.hint++;
                case 'K':
                    this.key.push(reward);
                default:
                    console.log("Error | Impossible Reward");
            }
        }
    }

    canPass(block) {
        if (block instanceof WallBlock) {
            return false
        } else if (block instanceof DoorBlock) {
            return block.keyIDs.every(keyID => this.key.includes(keyID));
        } else if (block instanceof FloorBlock) {
            return true
        } else if (block instanceof ProblemBlock) {
            return false // problem is kind of box so player can't go through
        } else {
            console.log('Error | Block type')
        }
    }

    getFlashArea() {
        var dirFlashArea = [];
        for (var i = 0; i < 8; i++) {
            dirFlashArea.push([FlashArea[i][0] * this.dir.x + FlashArea[i][1] * this.dir.y, FlashArea[i][0] * this.dir.y + -FlashArea[i][1] * this.dir.x]);
        }   
        var ret = [];
        if(this.canPass(this.map.blocks[this.x + dirFlashArea[0][0]][this.y + dirFlashArea[0][1]])){
            ret.push(dirFlashArea[0]);
            ret.push(dirFlashArea[3]);
            ret.push(dirFlashArea[4]);
        }
        if(this.canPass(this.map.blocks[this.x + dirFlashArea[1][0]][this.y + dirFlashArea[1][1]])){
            ret.push(dirFlashArea[1]);
            ret.push(dirFlashArea[5]);
            ret.push(dirFlashArea[4]);
            ret.push(dirFlashArea[6]);
        }
        if(this.canPass(this.map.blocks[this.x + dirFlashArea[2][0]][this.y + dirFlashArea[2][1]])){
            ret.push(dirFlashArea[2]);
            ret.push(dirFlashArea[7]);
            ret.push(dirFlashArea[6]);

        }
        return ret

    }

    inFlashArea(block) {
        return this.getFlashArea(block).some(area => isEqual(area, [block.x - this.x, block.y - this.y]))
        
    }

    useTrap(block) {
        this.trap--;
        if (block.type == 'F') { // 바닥에만 트랩 깔 수 있음
            block.addTrap();
        } else {
            //'문, 문제상자, 벽에는 트랩을 놓을 수 없습니다.' 팝업
        }

        // 어떤 칸에서 나갈 때 감지하기
    }

    useFlash() {
        this.flash--;
        this.usingFlash = true;
    }

    useHint() {
        this.hint--;
    }
}

module.exports = PlayerObject;