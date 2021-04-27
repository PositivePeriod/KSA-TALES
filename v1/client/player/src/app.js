import { Network } from './util/network.js';
import { KeyboardManager } from './util/inputManager.js';
import { MapObject } from './entity/mapObject.js';

class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.showRange = { width: 5, height: 3 };
        var m = 2 * this.showRange.width + 1;
        var n = 2 * this.showRange.height + 1;
        this.map = new MapObject(this.stageWidth, this.stageHeight, m, n, this.ctx);

        this.commandKey = {
            'KeyUp': 'KeyW',
            'KeyLeft': 'KeyA',
            'KeyDown': 'KeyS',
            'KeyRight': 'KeyD',
            'KeyInteract': 'Space',
            'KeyAnswer': 'Enter'
        }
        this.network = new Network(this.map);
        this.network.connect();

        this.keyboard = new KeyboardManager();
        this.keyboard.listen(this.commandKey['KeyUp'], this.network.tryToSendCommand.bind(this.network));
        this.keyboard.listen(this.commandKey['KeyLeft'], this.network.tryToSendCommand.bind(this.network));
        this.keyboard.listen(this.commandKey['KeyDown'], this.network.tryToSendCommand.bind(this.network));
        this.keyboard.listen(this.commandKey['KeyRight'], this.network.tryToSendCommand.bind(this.network));
        this.keyboard.listen(this.commandKey['KeyInteract'], this.network.tryToSendCommand.bind(this.network));
        this.keyboard.listen(this.commandKey['KeyAnswer'], this.network.tryToSendCommand.bind(this.network));
        this.keyboard.activate();

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        var pseudoInput = { 'AA': 'AA1_1', 'code': 'CDQE', 'name': 'Lets go' } // TODO
        this.network.joinGame(pseudoInput.AA, pseudoInput.code, pseudoInput.name);


    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.map.resize(this.stageWidth, this.stageHeight);

        // draw?
    }

    draw() {
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        this.map.draw();
        this.player.draw(this.ctx);
    }
}

window.onload = () => { new App(); }