// this.type은 W(벽), F(바닥), P( 문제가 있는 지역), D(문)의 대문자 알파벳으로 읽어들입니다
// this.pass는 True 타입일 때 지나갈(올라갈) 수 있고, False 타입일 때 지나갈(올라설) 수 없습니다
//

var quiz_id = { 1: 'ocean', 2: 'fish' };
var answer_id = { 'ocean': 'fish' };

quiz_id[''] = '(해당html)';

const blockCOLOR = Object.freeze({
    W: { r: 0, g: 0, b: 0 },
    D: { r: 10, g: 0, b: 0 },
    F: { r: 170, g: 100, b: 16 },
    P: { r: 27, g: 254, b: 86 }
})

class BlockObject {
    constructor(type, x, y) {
        this.type = type; // W D F P // TODO Ex) this.type = 'W'; WallBlock 은 duplicate한 정보를 가지지만 일단은 편의를 위해 남길 것
        this.x = x;
        this.y = y;
        this.color = blockCOLOR[this.type]; // TODO 지우기 client에서 처리하기
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
    constructor(type, x, y, id, reward) {
        super(type, x, y);
        this.id = id;
        this.reward = reward;// TODO set reward
        this.flag=0; //열린 문제인지 아닌지 
    }


    showProblem(player) {
        if(player.keyInput == 'space') {
            //show quiz_id[th=is.id]
            var playerAnswer = null; // TODO get answer
            var problemAnswer = answer_id['quiz_id'];
            if (playerAnswer === problemAnswer && player.isSolved(this.id) === false) {
                player.solve(this.id);
                player.getItems(this.reward);
                //player가 정답을 맞혔다면 this.id return, player에서는 player.isSolved에 문제 id 저장 (열쇠를 획득했다는 개념)
            } 
            else return False;
        }
        //if(player.keyInput == 'h'){
        //  
        //}
        // TODO showProblem
        // quiz_id[this.id]
    }
}

module.exports = { WallBlock, DoorBlock, FloorBlock, ProblemBlock };