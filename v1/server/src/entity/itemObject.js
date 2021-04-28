// item의 type는 Key(K), Trap(T), Light(L), Attack(A) 네 종류가 있습니다(추가 가능)
// 힌트 아이템 -> 모르는 문제가 있을 때 힌트 사용 
// trap : 걸리면 어디 다녀와야 함

class ItemObject {
    constructor(type) {
        this.type = type;
        this.number = 0;
    }

    doesExist() {
        return this.number !== 0;
    }

    add() {
        this.number += 1;
    }

    use() {
        this.number -= 1;
        // TODO add logic
    }

    show() {
        return { 'type': this.type, 'number': this.number }
    }
}

class KeyItem extends ItemObject {
    constructor(keyID) {
        super('K');
        this.keyID = keyID;
    }

    use() {

    }
}

class HintItem extends ItemObject {
    constructor() {
        super('H');
    }

    use() {

    }
}

class FlashItem extends ItemObject {
    constructor() {
        super('F');
    }

    use(player) {
        player.usingFlash = true;
        
    }
}

class TrapItem extends ItemObject {
    constructor() {
        super('T');
    }

    use(player, currentBlock) {
        if (currentBlock.type == 'F') { // 바닥에만 트랩 깔 수 있음
            currentBlock.addTrap(this.id)
        } else {
            //'문, 문제상자, 벽에는 트랩을 놓을 수 없습니다.' 팝업
        }

        // 어떤 칸에서 나갈 때 감지하기
    }
}

module.exports = { KeyItem, HintItem, FlashItem, TrapItem };