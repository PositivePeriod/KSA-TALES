// this.type은 W(벽), F(바닥), Q(퀴즈, 문제가 있는 지역), D(문)의 대문자 알파벳으로 읽어들입니다
// this.pass는 True 타입일 때 지나갈(올라갈) 수 있고, False 타입일 때 지나갈(올라설) 수 없습니다

var quiz_id = { 1: 'ocean', 2: 'fish' };
var answer_id = {'ocean' : 'fish'};

quiz_id[''] = '(해당html)';

export class BlockObject {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
    }
}

export class WallObject extends BlockObject {
    constructor(type, x, y) {
        super(type, x, y);
        this.color = { r: 0, g: 0, b: 0 };
    }

    canPass(player) {
        return false
    }
}

export class DoorObject extends BlockObject {
    constructor(type, x, y, problemIDs) {
        super(type, x, y);
        this.problemIDs = problemIDs;
        this.color = { r: 10, g: 0, b: 0 };
    }

    canPass(player) {
        return this.problemIDs.every(problem => player.isSolved(problem));
    }
}

export class FloorObject extends BlockObject {
    constructor(type, x, y) {
        super(type, x, y);
        this.color = { r: 170, g: 100, b: 16 };
    }

    canPass(player) {
        return true;
    }
}

export class ProblemObject extends BlockObject {
    constructor(type, x, y, id) {
        super(type, x, y);
        this.id = id;
        this.color = { r: 27, g: 254, b: 86 };
    }

    canPass(player) {
        return true;
    }

    showProblem(player) {
        if(player.keyInput == 'space')
        {
            //show quiz_id[this.id]
            if(player.answerInput == answer_id['quiz_id'])//player가 정답을 맞혔다면 this.id return, player에서는 player.isSolved에 문제 id 저장 (열쇠를 획득했다는 개념)
            {
                return this.id;
            }
            else return False;
        }
        // TODO showProblem
        // quiz_id[this.id]
    }
}
