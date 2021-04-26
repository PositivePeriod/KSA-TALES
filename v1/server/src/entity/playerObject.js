import { MapObject } from "./mapObject.js";

export class PlayerObject extends MapObject {
    constructor(x, y, color, keyboard, mouse) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.dir = 'up'
        this.solved = [];
        this.inventory = [];
        this.keyboard = keyboard;
        this.mouse = mouse;
    }

    move(keyInput) {
        if (keyInput == 'KeyD') {
            var next = this.data[this.x+1][this.y];
            if (next.type == 'F') {
                this.x += 1
                this.dir = 'right'
            }
        }
        if (keyInput == 'KeyA') {
            var next = this.data[this.x-1][this.y];
            if (next.type == 'F') {
                this.x += 1
                this.dir = 'left'
            }
        }
        if (keyInput == 'KeyW') {
            var next = this.data[this.x][this.y+1];
            if (next.type == 'F') {
                this.x += 1
                this.dir = 'up'
            }
        }
        if (keyInput == 'KeyS') {
            var next = this.data[this.x][this.y-1];
            if (next.type == 'F') {
                this.x += 1
                this.dir = 'down'
            }
        }
        if (keyInput == 'KeyF') {
            //var qid = next.id;
            // open question with qid
        }
        return x, y
    }

    useitem(idx) {
        var item = inventory[idx]
        
    }

}