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
                //blah blah
        }
    }
}

export class KeyItem extends ItemObject {
    constructor(id) {
    }

    use() {

    }
}

export class FlashItem extends ItemObject {
    constructor() {

    }

    use() {
        
    }
}

export class TrapItem extends ItemObject {
    constructor() {

    }

    use() {
        
    }
}