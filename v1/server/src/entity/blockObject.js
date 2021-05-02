class BlockObject {
    constructor(type, x, y, roomIDs) {
        this.type = type; // W D F P // TODO Ex) this.type = 'W'; WallBlock 은 duplicate한 정보를 가지지만 일단은 편의를 위해 남길 것
        this.x = x; // posX
        this.y = y; // posY
        this.roomIDs = roomIDs;
    }

    show(player) {
        return {
            type: this.type,
            light: false,
            showTrap: false
        }
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

    show(player) {
        if (this.weak) {
            return { type: 'Y', light: false, showTrap: false }
        } else {
            return { type: this.type, light: false, showTrap: false }
        }

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
        this.trapNum = 0;
        this.isBroken = false;
    }

    existTrap() {
        return this.trapNum > 0
    }

    addTrap() {
        this.trapNum = 1;
    }

    deleteTrap() {
        this.trapNum = 0;
    }

    show(player) {
        var brokenType = this.type;
        if (this.isBroken) {
            brokenType = "B";
        }
        if (player.usingFlash && player.inFlashArea(this)) {
            return { type: brokenType, light: true, showTrap: this.existTrap() }
        } else {
            return { type: brokenType, light: false, showTrap: false }
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

    show(player) {
        if (this.id.slice(0, 1) == 'X') {
            return {
                type: "G", //Gift
                light: false,
                showTrap: false
            }
        }
        return {
            type: this.type,
            light: false,
            showTrap: false
        }
    }
}

module.exports = {
    WallBlock,
    DoorBlock,
    FloorBlock,
    ProblemBlock
};