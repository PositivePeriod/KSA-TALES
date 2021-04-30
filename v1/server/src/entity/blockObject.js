class BlockObject {
    constructor(type, x, y, roomIDs) {
        this.type = type; // W D F P // TODO Ex) this.type = 'W'; WallBlock 은 duplicate한 정보를 가지지만 일단은 편의를 위해 남길 것
        this.x = x; // posX
        this.y = y; // posY
        this.roomIDs = roomIDs;
    }

    show(player) {
        return { type: this.type, light: false, showTrap: false }
    }
}

class WallBlock extends BlockObject {
    constructor(x, y, roomIDs) {
        super('W', x, y, roomIDs);
    }
}

class DoorBlock extends BlockObject {
    constructor(x, y, roomIDs, keyIDs){
        super('D', x, y, roomIDs);
        this.keyIDs = keyIDs;
    }
}

// class KeyDoorBlock extends BlockObject { //문 중에 특정 열쇠가 필요한 문
//     constructor(type, x, y, keyIDs) { //keyIDs list
//         super(type, x, y);
//         this.keyIDs = keyIDs;
//     }

//        canopen(keys){ //inventory 중에서 keys list input
//            for(i = 0;i < this.keyIDs.length;i++){
//                if(keys.includes(this.keyIDs[i])==false){
//                  return false;
//              }
//          }
//          return true;
//      }
// }

class FloorBlock extends BlockObject {
    constructor(x, y, roomIDs) {
        super('F', x, y, roomIDs);
        this.trapnum = 0;
    }

    existTrap() {
        return this.trapnum > 0
    }

    addTrap() {
        this.trapnum++;
    }

    deleteTrap() {
        this.trapnum--;
    }

    show(player) {
        if (player.usingFlash && player.inFlashArea(this)) {
            console.log("Trap detected");
            return {type: this.type, light: true, showTrap: this.existTrap()}
        } else {
            return {type: this.type, light: false, showTrap: false}
        }
    }
    
}

class ProblemBlock extends BlockObject {
    constructor(x, y, roomIDs, id, answer, reward) {
        super('P', x, y, roomIDs);
        this.id = id;
        this.answer = answer;
        this.reward = reward; // TODO set reward
    }

    //getProblem(player) {
      //  console.log(player.AA);
        // var playerAnswer = null; // TODO get answer
        // if (playerAnswer === this.answer && !(player.isSolved(this.id))) {
        //     player.solve(this.id);
        //     player.getItems(his.reward);
        //     //player가 정답을 맞혔다면 this.id return, player에서는 player.isSolved에 문제 id 저장 (열쇠를 획득했다는 개념)
        // } else {
        //     return false;
        // }
    //}
}

module.exports = { WallBlock, DoorBlock, FloorBlock, ProblemBlock };