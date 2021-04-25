// this.type은 W(벽), F(바닥), Q(퀴즈, 문제가 있는 지역), D(문)의 대문자 알파벳으로 읽어들입니다
// this.pass는 True 타입일 때 지나갈(올라갈) 수 있고, False 타입일 때 지나갈(올라설) 수 없습니다

var quiz_id = {};

quiz_id[''] = '(해당html)';

export class BlockObject {
    constructor(type, x, y, size, id) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
        this.id = id;
        
        this.margin = 2;
        this.pass = true;
        this.color = 'rgba(0, 0, 0, 0.4)';
    }

    resize(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + this.margin, this.y + this.margin, this.size - 2 * this.margin, this.size - 2 * this.margin);
    }

    change(type) {
        this.type = type;
        this.init();
    }

    checkpass(){//player에 대해서 지나갈 수 있는지 확인하는 함수
        
    }
    activate(type, id){
        if(this.type == 'D')//해당 블럭이 문일 때 player에 대해서 지나갈 수 있는 player인지 확인 후 pass=True로 함
        {
            return this.checkpass();
        }
        if(this.type == 'Q')//해당 블럭이 퀴즈일 때 어떤 동작 후 퀴즈 보여주기
        {
            return quiz_id[id];//해당 문제의 html 반환
        }
    }

    init() {
        switch (this.type){
            case 'W'://벽
                this.color = 'rgba(0,0,0,1)';
                this.pass=false;//false이면 못 지나감
            case 'D'://문
                this.color = 'rgba(10,0,0,1)';
                this.pass = False; //초기에는 못 지나감
            case 'F'://floor, 바닥
                this.color = 'rgba(170, 100, 16, 1)';
                this.pass = True; //바닥은 지나갈 수 있음
            case 'Q': // quiz, 문제가 있는 지역
                this.color = 'rgba(27, 254, 86, 1)';
                this.pass = True; //문제 지역 지나갈 수 있음.
            default:
                alert('No matched block type for '+this.type.toString())
        }
    }
}