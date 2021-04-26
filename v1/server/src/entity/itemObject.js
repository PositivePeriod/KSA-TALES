// item의 type는 Key(K), Trap(T), Light(L) 세 종류가 있습니다(추가 가능)


export class itemObject {
    constructor(x, y, id, type, map) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.type = type;
        this.map = map;
    }

    dirToCoord(dir){
        switch(dir){
            case 'w':
                return [0,1];
            case 'a':
                return [-1,0];
            case 's':
                return [0,-1];
            case 'd':
                return [1,0];
        }
        console.log('Wrong Dir in app.js dirToCoord');
    }

    activate(player) {
        var x = player.x;
        var y = player.y;
        switch (this.type) {
            case 'T':
                this.map.data[x][y].addTrap();
            case 'L':
                var dirincoord = this.dirToCoord(player.dir);
                const around = [[0,0], dirincoord] // has to be modified
                for ([dx,dy] of around) {
                    this.map.data[x+dx][y+dy].brighten();
                }
        }
    }
}