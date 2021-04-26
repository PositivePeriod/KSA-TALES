import { KeyboardManager, MouseManager } from "../../client/util/inputManager.js";
import { MapObject } from "./entity/mapObject.js";
import { PlayerObject } from "./entity/playerObject";
import { blockObject } from "./entity/blockObject";

class Game {
    constructor() {
        this.fps = 10;

        this.keyboard = new KeyboardManager();
        this.mouboard.activate();
        this.mousse = new MouseManager();
        this.keye.activate();

        this.objectSystem = new GameObjectSystem();
        this.objectSystem.extend([ 
            new PlayerObject(400, 400, 30, this.keyboard, this.mouse),
            new MapObject(300, 300, 100, 100, { healthChange: 5 }),
            new MapObject(500, 500, 100, 100, { healthChange: -5 }),
        ]);
        
        this.players = {} //id : object

        // player object needs
        // id,x,y,dir (dir is one of the ['w','a','s','d'])
        // 
        // player.move(dx,dy) (move with dx and dy)
        // player.setDir(dir) (dir is one of [w,a,s,d]) 
        //

        this.map = new Map //map : object that contain grid which have object inside
        // map needs
        // map.check(x,y) check whether player can go to (x,y)
        // map.movePlayer(id,dx,dy) move player of responding id with dx and dy
        // map.draw(x,y) 
        // map.activate(x,y) activate object in (x,y)


        setInterval(this.objectSystem.update.bind(this, 1), Math.round(1000 / this.fps));
    }

    appendPlayer(id,player){
        this.players[id] = player;
    }

    removePlayer(id){
        if(this.players.hasOwnProperty(id)){ delete this.players[id]; }
        else{ console.log('Non-existing player id');}

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

    movePlayer(id,dir){
        var player = this.players[id];
        const [dx,dy] = this.dirToCoord(dir)
        if(this.map.check(player.x+dx,player.y+dy)){
            player.move(dx,dy)
            this.map.movePlayer(id,dx,dy)
        }
        else{player.setDir(dir)}

        
    }

    playerActivateBlock(id){
        var player = this.players[id];
        var [dx,dy] = this.dirToCoord(player.dir);
        this.map.activate(player.x+dx,player.y+dy);
    }

    useInp(id,inp){
        if(['w','a','s','d'].includes(inp)){
            this.movePlayer(id,inp); //inp would be dir
        }
        else if(inp == 'space'){
            this.PlayerActivateBlock(id);
        }
    }



    update(){
        var inputQueue = [ //player's input dictionary {id : (w,a,s,d,space)}
            [1 , 'w'],
            [2 , 'a']
        ]

        while(inputQueue.length != 0){
            var [id,inp] = inputQueue.shift();
            this.useInp(id,inp);
        }

        this.map.draw()

    }
    
}

window.onload = () => {
    new Game();
}