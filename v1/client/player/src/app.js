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

        this.pixelRatio = 1;
        // this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
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
            'KeyAnswer': 'Enter',
            'KeyTrap' : 'Digit1',
            'KeyFlash' : 'Digit2',
            'KeyHint' : 'Digit3'
        }
        this.network = new Network(this.map);
        this.network.connect();

        this.keyboard = new KeyboardManager();
        this.keyboard.listen(this.commandKey['KeyUp'], this.network.tryToSendCommand.bind(this.network, "KeyUp"));
        this.keyboard.listen(this.commandKey['KeyLeft'], this.network.tryToSendCommand.bind(this.network, "KeyLeft"));
        this.keyboard.listen(this.commandKey['KeyDown'], this.network.tryToSendCommand.bind(this.network, "KeyDown"));
        this.keyboard.listen(this.commandKey['KeyRight'], this.network.tryToSendCommand.bind(this.network, "KeyRight"));
        this.keyboard.listen(this.commandKey['KeyInteract'], this.network.tryToSendCommand.bind(this.network, "KeyInteract"));
        this.keyboard.listen(this.commandKey['KeyAnswer'], this.network.tryToSendCommand.bind(this.network, "KeyAnswer"));
        this.keyboard.listen(this.commandKey['KeyTrap'], this.network.tryToSendCommand.bind(this.network, "KeyTrap"));
        this.keyboard.listen(this.commandKey['KeyFlash'], this.network.tryToSendCommand.bind(this.network, "KeyFlash"));
        this.keyboard.listen(this.commandKey['KeyHint'], this.network.tryToSendCommand.bind(this.network, "KeyHint"));
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
    }
}

window.onload = () => { new App(); }