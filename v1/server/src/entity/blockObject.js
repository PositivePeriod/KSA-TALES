class BlockObject {
    constructor(type, x, y) {
        this.type = type; // W D F P // TODO Ex) this.type = 'W'; WallBlock 은 duplicate한 정보를 가지지만 일단은 편의를 위해 남길 것
        this.x = x;
        this.y = y;
    }

    show() {
        return { type: this.type, color: this.color }
    }
}

class WallBlock extends BlockObject {
    constructor(type, x, y) {
        super(type, x, y);
    }
}

class DoorBlock extends BlockObject {
    constructor(type, x, y, problemIDs) {
        super(type, x, y);
        this.problemIDs = problemIDs;
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
    constructor(type, x, y) {
        super(type, x, y);
        //this.isTrap = false;
    }
    //addTrap(id){
    //  this.isTrap = True;
    //}
    //canpass(){
    //  if(this.isTrap) return False;
    //  else return True;
    //}
}

class ProblemBlock extends BlockObject {
    constructor(type, x, y, id, answer, reward) {
        super(type, x, y);
        this.id = id;
        this.answer = answer;
        this.reward = reward;// TODO set reward
    }

    showProblem(player) {
        var playerAnswer = null; // TODO get answer
        if (playerAnswer === this.answer && !(player.isSolved(this.id))) {
            player.solve(this.id);
            player.getItems(this.reward);
            //player가 정답을 맞혔다면 this.id return, player에서는 player.isSolved에 문제 id 저장 (열쇠를 획득했다는 개념)
        } 
        else return False;
        //if(player.keyInput == 'h'){
        //  
        //}
        // TODO showProblem
        // quiz_id[this.id]
    }
}

module.exports = { WallBlock, DoorBlock, FloorBlock, ProblemBlock };