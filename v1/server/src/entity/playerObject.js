const InputDeque = require("../util/deque");
const { WallBlock, DoorBlock, FloorBlock, ProblemBlock } = require("./blockObject");

class PlayerObject {
    constructor(socketID, AA, name, x, y) {
        this.socketID = socketID;
        this.AA = AA;
        this.name = name;
        this.x = x;
        this.y = y;
        this.solvedProblemIDs = []; // TODO problemIDS 다 없애고 키로 만들기
        this.inventory = [];
        this.num_hint = 0;
        this.commandQueue = new InputDeque();

        this.dir = { x: 0, y: -1 };
        this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    }

    show() {
        return { 'name': this.name, 'AA': this.AA, 'color': this.color, 'x': this.x, 'y': this.y, 'dir': this.dir }
    }

    useItems() {
        //
    }

    getItems(items) {
        this.inventory = this.inventory.concat(items)
    }

    solve(problemID) {
        this.solvedProblemIDs.push(problemID)
        // TODO notice to others, 업적?
    }

    isSolved(problemID) {
        if (problemID in this.solvedProblemIDs) {
            return true
        } else return false
    }

    canPass(block) {
        if (block instanceof WallBlock) {
            return false
        } else if (block instanceof DoorBlock) {
            return block.problemIDs.every(problemID => this.isSolved(problemID));
        } else if (block instanceof FloorBlock) {
            return true
        } else if (block instanceof ProblemBlock) {
            return false // problem is kind of box so player can't go through
        } else {
            console.log('Block type error')
        }
    }
}

module.exports = PlayerObject;