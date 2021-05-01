class BlockObject {
    constructor(type, x, y, roomIDs) {
        this.type = type; // W D F P // TODO Ex) this.type = 'W'; WallBlock 은 duplicate한 정보를 가지지만 일단은 편의를 위해 남길 것
        this.x = x; // posX
        this.y = y; // posY
        this.roomIDs = roomIDs;
    }

    show(player) {
        return { type: this.type, light: false, showTrap: false }
    }
}

class WallBlock extends BlockObject {
    constructor(x, y, roomIDs, weakness) {
        super('W', x, y, roomIDs);
        this.weak = weakness;
    }

    appendRoomIDs(newroomIDs) {
        var merged = this.roomIDs.concat(newroomIDs);
        this.roomIDs = merged.filter((item, pos) => merged.indexOf(item) === pos);
    }
}

class DoorBlock extends BlockObject {
    constructor(x, y, roomIDs, keyIDs, weakness) {
        super('D', x, y, roomIDs);
        this.keyIDs = keyIDs;
        this.weak = weakness;
    }
}

class FloorBlock extends BlockObject {
    constructor(x, y, roomIDs) {
        super('F', x, y, roomIDs);
        this.trapnum = 0;
    }

    existTrap() {
        return this.trapnum > 0
    }

    addTrap() {
        this.trapnum = 1;
    }

    deleteTrap() {
        this.trapnum = 0;
    }

    show(player) {
        if (player.usingFlash && player.inFlashArea(this)) {
            return { type: this.type, light: true, showTrap: this.existTrap() }
        } else {
            return { type: this.type, light: false, showTrap: false }
        }
    }

}

class DestroyedDoorBlock extends FloorBlock {
    constructor(x, y, roomIDs) {
        super(x, y, roomIDs);
    }
}

class DestroyedWallBlock extends FloorBlock {
    constructor(x, y, roomIDs) {
        super(x, y, roomIDs);
    }
}

class ProblemBlock extends BlockObject {
    constructor(x, y, roomIDs, id, answer, reward) {
        super('P', x, y, roomIDs);
        this.id = id;
        this.answer = answer;
        this.reward = reward; // TODO set reward
    }

    //getProblem(player) {
    //  console.log(player.AA);
    // var playerAnswer = null; // TODO get answer
    // if (playerAnswer === this.answer && !(player.isSolved(this.id))) {
    //     player.solve(this.id);
    //     player.getItems(his.reward);
    //     //player가 정답을 맞혔다면 this.id return, player에서는 player.isSolved에 문제 id 저장 (열쇠를 획득했다는 개념)
    // } else {
    //     return false;
    // }
    //}
}

module.exports = { WallBlock, DoorBlock, FloorBlock, ProblemBlock };