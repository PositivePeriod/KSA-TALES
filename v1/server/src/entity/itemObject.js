// item의 type는 Key(K), Trap(T), Flash(F) 세 종류가 있습니다(추가 가능)


class ItemObject {
    constructor(id, problemid, type) {
        this.id = id;
        this.problemid = problemid;
        this.type = type;
    }
}

export class KeyItem extends ItemObject {
    constructor(id, problemid, type) {
        super(id,problemid,type)
    }

    use() {

    }
}

export class FlashItem extends ItemObject {
    constructor(id, problemid, type) {
        super(id,problemid,type)
    }

    use(player) {
        
    }
}

export class TrapItem extends ItemObject {
    constructor(id, problemid, type) {
        super(id,problemid,type)
    }

    use(player, currentBlock) {
        currentBlock.addTrap(this.id)
    }
}