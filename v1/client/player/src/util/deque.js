export class InputDeque {
    constructor() {
        this.reset();
    }

    reset() {
        this.items = [];
    }

    push(item) {
        this.items.push(item);
    }

    pull() {
        this.items.pop(); // 마지막으로 넣은 거 다시 빼기
    }

    pop() {
        return this.items.shift() || null;
    }

    getSize() {
        return this.items.length;
    }

    isEmpty() {
        return this.getSize() === 0;
    }
}