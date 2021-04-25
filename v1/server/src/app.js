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

        setInterval(this.objectSystem.update.bind(this, 1), Math.round(1000 / this.fps));
    }

    appendPlayer(id,player){
        this.players[id] = player;
    }

    removePlayer(id){
        if(this.players.hasOwnProperty(id)){ delete this.players[id]; }
        else{ console.log('Non-existing player id');}

    }

    directionToxy(dir,x,y){

    }

    movePlayer(id){
        var player = this.players[id];
        
    }

    update(){
        var inputList = { //player's input dictionary {id : (w,a,s,d)}
            1 : 'w',
            2 : 'a'
        }

        Object.entries(inputList).forEach(([key, value]) => {
            this.players[key].move(value);
        });




        

        
        
        
    }
    
}

window.onload = () => {
    new Game();
}