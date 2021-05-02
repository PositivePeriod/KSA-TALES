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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

class PlayerObject {
    constructor(socketID, AA, name, x, y, map) {
        this.socketID = socketID;
        this.AA = AA;
        this.name = name;
        this.x = x;
        this.y = y;


        this.map = map;
        this.visitedRoom = []
        this.visitedDoor = []
        this.solvedProblemIDs = []
        this.inventory = new Map([
            ['keys', []],
            ['trap', 100],
            ['flash', 100],
            ['hint', 1],
            ['hammer', 10]
        ]);

        this.commandQueue = new InputDeque();

        this.dir = { x: 0, y: 1 };

        this.flashx = x;
        this.flashy = y;
        this.flashdir = this.dir;

        this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);

        this.canMove = true;
        this.watchProblem = null;

        this.trapNum = getRandomInt(0, 10);
        this.watchTrap = null;

        this.usingFlash = false;
    }
    
    toData(){
        return {
            'x' : this.x,
            'y' : this.y,
            'inventory' : new Map([
                ['keys', this.inventory.keys],
                ['trap', this.inventory.trap],
                ['flash', this.inventory.flash],
                ['hint', this.inventory.hint],
                ['hammer', this.inventory.hammer]
            ]),
            'isTraped' : (this.watchTrap == null),
            "trapNum" :this.trapNum
        }
    }
    
    applyData(data,map){
        this.x = data.x,
        this.y = data.y,
        this.inventory = new Map([
            ['keys', data.keys],
            ['trap', data.trap],
            ['flash', data.flash],
            ['hint', data.hint],
            ['hammer', data.hammer]
        ]);
        this.trapNum = data.trapNum
        if(data.isTraped){
            this.trapNum-=1;
            block = this.map.getBlock(this.x, this.y);
            this.inventory.trap += 1
            this.useTrap(block);
        }

    }

    show(dx, dy) {
        return {
            'name': this.name,
            'AA': this.AA,
            'color': this.color,
            'x': this.x - dx,
            'y': this.y - dy,
            'dir': this.dir
        }
    }

    checkAnswer(problemBlock, answer) {
        if (problemBlock.answer == answer) {
            this.solve(problemBlock.id, problemBlock.answer);
        }
    }

    solve(problemID, rewards) {
        if (this.solvedProblemIDs.includes(problemID)) {
            // console.log('Already solve this problem!')
            return;
        }
        this.solvedProblemIDs.push(problemID)
        console.log(rewards);
        rewards.forEach((reward) => {
            switch (reward.slice(0, 1)) {
                case 'T':
                    this.inventory.set("trap", this.inventory.get("trap") + 1);
                    break;
                case 'F':
                    this.inventory.set("flash", this.inventory.get("flash") + 1);
                    break;
                case 'H':
                    this.inventory.set("hint", this.inventory.get("hint") + 1);
                    break;
                case 'K':
                    var keys = this.inventory.get("keys");
                    keys.push(reward);
                    console.log(keys)
                    this.inventory.set("keys", keys);
                    break;
                default:
                    console.log("Error | Impossible Reward");
            }
        })
    }

    canPass(block) {
        if (block instanceof WallBlock) {
            return false
        } else if (block instanceof DoorBlock) {
            var keys = this.inventory.get('keys');
            console.log(block.keyIDs, keys)
            return block.keyIDs.every(keyID => {
                return keys.includes(keyID)
            });
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
        if (this.canPass(this.map.blocks[this.x + dirFlashArea[0][0]][this.y + dirFlashArea[0][1]])) {
            ret.push(dirFlashArea[0]);
            ret.push(dirFlashArea[3]);
            ret.push(dirFlashArea[4]);
        }
        if (this.canPass(this.map.blocks[this.x + dirFlashArea[1][0]][this.y + dirFlashArea[1][1]])) {
            ret.push(dirFlashArea[1]);
            ret.push(dirFlashArea[5]);
            ret.push(dirFlashArea[4]);
            ret.push(dirFlashArea[6]);
        }
        if (this.canPass(this.map.blocks[this.x + dirFlashArea[2][0]][this.y + dirFlashArea[2][1]])) {
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
        this.inventory.set('trap', this.inventory.get('trap') - 1);

        if (block.type === 'F') { // 바닥에만 트랩 깔 수 있음
            block.addTrap(this.name);
        } else {
            //'문, 문제상자, 벽에는 트랩을 놓을 수 없습니다.' 팝업
        }
        // 어떤 칸에서 나갈 때 감지하기
    }

    useFlash() {
        this.usingFlash = !this.usingFlash;
    }

    checkFlash() {
        if (this.usingFlash == false) {
            return;
        }
        if (this.flashx == this.x && this.flashy == this.y && this.flashdir == this.dir) {
            this.usingFlash = true;
        } else {
            if (this.inventory.get('flash') == 0) {
                this.usingFlash = false
            } else {
                this.inventory.set('flash', this.inventory.get('flash') - 1);
            }
        }
        this.flashx = this.x;
        this.flashy = this.y;
        this.flashdir = this.dir;
    }

    useHint() {
        this.inventory.set("hint", this.inventory.get("hint") - 1);
    }

    useHammer() {
        this.inventory.set("hammer", this.inventory.get("hammer") - 1);
    }
}

module.exports = PlayerObject;