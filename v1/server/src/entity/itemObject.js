// item의 type는 Key(K), Trap(T), Light(L), Attack(A) 네 종류가 있습니다(추가 가능)


class ItemObject {
    constrctor(x, y, id, type, map) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.type = type;
        this.map = map;
    }

    use(id, player) {
        switch (this.type) {
            case 'K':
                //blah blah??
        }
    }
}

class KeyItem extends ItemObject {
    constructor(id) {

    }

    use(id) {

    }
}

export class FlashItem extends ItemObject {
    constructor(id, problemid, type) {
        super(id,problemid,type)
    }

    use(player) {
        player.usingFlash = true;
    }
}

export class TrapItem extends ItemObject {
    constructor(id, problemid, type) {
        super(id,problemid,type)
    }

    use(player, currentBlock) {
        if(currentBlock.type == 'F') { // 바닥에만 트랩 깔 수 있음
            currentBlock.addTrap(this.id)
        }
        else {
            //'문, 문제상자, 벽에는 트랩을 놓을 수 없습니다.' 팝업
        }
    }
}

module.exports = { KeyItem, FlashItem, TrapItem };