import { InputDeque } from "../util/deque";
import { WallBlock } from "./blockObject";

// define const Flash area of player
const FlashArea = Object.freeze({'w':[[0,1]], 's':[[0,-1]], 'd':[[1,0]], 'a':[[-1,0]]});

export class PlayerObject {
    constructor(socketID, AA, name, x, y) {
        this.socketID = socketID;
        this.AA = AA;
        this.name = name;
        this.x = x;
        this.y = y;
        this.solvedProblemIDs = []; // TODO problemIDS 다 없애고 키로 만들기
        this.passedSpecialDoors = [];
        this.inventory = [];
        this.command = new InputDeque();

        this.dir = { x: 0, y: -1 };
        this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        this.canmove = true;
        this.usingFlash = false;
    }

    getItems(items) {
        this.inventory = this.inventory.concat(items)
    }

    solve(problemID) {
        this.solvedProblemIDs.push(problemID)
        // TODO notice to others, 업적?
    }

    passSpecialDoor(doorID) {
        this.passedSpecialDoors.push(doorID)
    }

    isSolved(problemID) {
        if (problemID in this.solvedProblemIDs) {
            return true
        }
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
            console.log('Block type error');
        }
    }

    inFlashArea(block) {
        var currentFlashArea = FlashArea[this.dir];
        return [block.x - player.x, block.y - player.y] in currentFlashArea
    }
}