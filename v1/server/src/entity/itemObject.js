// item의 type는 Key(K), Trap(T), Light(L), Hint(H) 네 종류가 있습니다(추가 가능)
// 힌트 아이템 -> 모르는 문제가 있을 때 힌트 사용 
// trap : 걸리면 어디 다녀와야 함


// itemObject는 없애고 playerObject에 한 번에 넣는 게 나아서 그렇게 바꿈
// 따라서 이 파일은 사실 쓸모없음

class ItemObject {
    constructor(type, player) {
        this.type = type;
        this.number = 0;
        this.player = player;
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

class KeyItem {
    constructor(player) {
        super('K');
        this.keyIDs = [];
    }

    add() {

    }

    use() {

    }
}

class HintItem extends ItemObject {
    constructor(player) {
        super('H');
    }

    use() {

    }
}

class FlashItem extends ItemObject {
    constructor(player) {
        super('F');
    }

    use(player) {
        player.usingFlash = true;
    }
}

class TrapItem extends ItemObject {
    constructor(player) {
        super('T');
    }

    use(currentBlock) {
        if (this.number > 0) {
            if (currentBlock.type == 'F') { // 바닥에만 트랩 깔 수 있음
                currentBlock.addTrap();
            } else {
                //'문, 문제상자, 벽에는 트랩을 놓을 수 없습니다.' 팝업
            }

            // 어떤 칸에서 나갈 때 감지하기
        } else {
            // '아이템이 없습니다.' 팝업
        }
    }
}

module.exports = { KeyItem, HintItem, FlashItem, TrapItem };