// item의 type는 Key(K), Trap(T), Light(L), Attack(A) 네 종류가 있습니다(추가 가능)
// 힌트 아이템 -> 모르는 문제가 있을 때 힌트 사용 
// trap : 걸리면 어디 다녀와야 함

class ItemObject {
    constructor(x, y, id, type, map) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.type = type;
        this.map = map;
    }

    use(id, player) {
        switch (this.type) {
            case 'K':
                //blah blah
        }
    }
}

class KeyItem extends ItemObject {
    constructor(id) {
        this.id = id;
    }

    use(id) {

    }
}

//export class HintItem extends ItemObject {
//  constructor(id, type){
//      super(id, type)
//  }
//  
//}

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