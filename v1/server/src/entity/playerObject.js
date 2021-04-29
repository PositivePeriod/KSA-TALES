const InputDeque = require("../util/deque");
const { WallBlock, DoorBlock, FloorBlock, ProblemBlock } = require("./blockObject");

// TODO / define const Flash area of player
const FlashArea = [[1,1], [1,0], [1,-1], [0,1], [0,-1], [-1,1], [-1,0], [-1,-1]];
const isEqual = (first, second) => {
    return JSON.stringify(first) === JSON.stringify(second);
}

class PlayerObject {
    constructor(socketID, AA, name, x, y) {
        this.socketID = socketID;
        this.AA = AA;
        this.name = name;
        this.x = x;
        this.y = y;

        this.key = ["K1"];
        this.trap = 1;
        this.flash = 100;
        this.hint = 1;

        this.commandQueue = new InputDeque();
        this.dir = { x: 0, y: -1 };
        this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        this.canMove = true;
        this.usingFlash = false;
    }

    show() {
        return { 'name': this.name, 'AA': this.AA, 'color': this.color, 'x': this.x, 'y': this.y, 'dir': this.dir }
    }

    solve(problemID, rewards) {
        this.solvedProblemIDs.push(problemID)
        for (reward of rewards) {
            switch(reward.charAt(0)) {
                case 'T': this.trap++;
                case 'F': this.flash++;
                case 'H': this.hint++;
                case 'K': this.key.push(reward);
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

    inFlashArea(block) {
        return FlashArea.some(area => isEqual(area, [block.x - this.x, block.y - this.y]))
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