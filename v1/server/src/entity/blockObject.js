// this.type은 W(벽), F(바닥), Q(퀴즈, 문제가 있는 지역), D(문)의 대문자 알파벳으로 읽어들입니다
// this.pass는 True 타입일 때 지나갈(올라갈) 수 있고, False 타입일 때 지나갈(올라설) 수 없습니다

var quiz_id = { 1: 'ocean', 2: 'fish' };
var answer_id = { 'ocean': 'fish' };

quiz_id[''] = '(해당html)';

const blockCOLOR = Object.freeze({
    W: { r: 0, g: 0, b: 0 },
    D: { r: 10, g: 0, b: 0 },
    F: { r: 170, g: 100, b: 16 },
    P: { r: 27, g: 254, b: 86 }
})

class BlockObject {
    constructor(type, x, y) {
        this.type = type; // W D F P
        this.x = x;
        this.y = y;
        this.color = blockCOLOR[this.type]; // TODO 지우기 client에서 처리하기
    }

    show() {
        return { type: this.type, color: this.color }
    }
}

export class WallBlock extends BlockObject {
    constructor(type, x, y) {
        super(type, x, y);
    }
}

export class DoorBlock extends BlockObject {
    constructor(type, x, y, problemID) {
        super(type, x, y);
        this.problemID = problemID;
    }
}

export class SpecialDoorBlock extends DoorBlock {
    constructor(type, x, y, id, problemID, keyids) {
        super(type, x, y);
        this.id = id;
        this.problemID = problemID;
        this.keyids = keyids;
    }

    showkeyholes() {
        // TODO
    }

    putkey(player, key) {
        if (key.id in this.keyids) {
            // success
            player.passSpecialDoor(this.id)
        } else {
            console.log('Not Correct Key!')
        }
    }
}

export class FloorBlock extends BlockObject {
    constructor(type, x, y, trapnum) {
        super(type, x, y);
        this.traps = [];
    }

    isTrapped() {
        return len(this.traps) > 0
    }

    addTrap(id) {
        this.traps.push(id)
    }

    show(player) {
        if (player.usingFlash && player.inFlashArea(this)) {
            return {type: this.type, traps: this.traps}
        } else {
            return {type: this.type, traps: null}
        }
    }

    getTrapped(player) {
        // 이거는 아래쪽에 ProblemBlcok에 있는 거랑 비슷하게 하면 될듯
        player.canmove = false;
        // TODO show trap[trap.id]
        trap = this.traps.pop()
        var playerAnswer = null; // TODO get answer
        var trapAnswer = trapAnswers[trap.id];
        if (trapAnswer == playerAnswer) {
            player.canmove = true;
        } else return false;
    }
}

export class ProblemBlock extends BlockObject {
    constructor(type, x, y, id, reward) {
        super(type, x, y);
        this.id = id;
        this.reward = []; // TODO set reward

    }

    show(player) {
        if (player.keyInput == 'space') {
            //show quiz_id[this.id]
            var playerAnswer = null; // TODO get answer
            var problemAnswer = answer_id['quiz_id'];
            if (playerAnswer === problemAnswer) {
                player.solve(this.id);
                player.getItems(this.reward);
                //player가 정답을 맞혔다면 this.id return, player에서는 player.isSolved에 문제 id 저장 (열쇠를 획득했다는 개념)
            } else return False;
        }
        // TODO showProblem
        // quiz_id[this.id]
    }
}