import { Network } from './util/network.js';
import { KeyboardManager } from './util/inputManager.js';
import { MapObject } from './entity/mapObject.js';
import { downloadAssets } from './util/assets.js';

class App {
    constructor() {
        downloadAssets();
        this.frame = document.getElementById('gameFrame');
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        var stageWidth = document.body.clientWidth;
        var stageHeight = document.body.clientHeight;

        this.grid = Math.min(stageWidth / this.m, stageHeight / this.n);
        this.stageWidth = this.grid * this.m;
        this.stageHeight = this.grid * this.n;

        this.frame.width = this.stageWidth * this.pixelRatio;
        this.frame.height = this.stageHeight * this.pixelRatio;
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;

        this.pixelRatio = 1; // TODO No need?
        // this.pixelRatio = window.devicePixelRatio || 1; // TODO error check?
        // this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.showRange = { width: 5, height: 3 };
        this.m = 2 * this.showRange.width + 1; // blockX
        this.n = 2 * this.showRange.height + 1; // blockY
        this.map = new MapObject(this.stageWidth, this.stageHeight, this.m, this.n, this.ctx);

        this.commandKey = {
            'KeyUp': 'KeyW',
            'KeyLeft': 'KeyA',
            'KeyDown': 'KeyS',
            'KeyRight': 'KeyD',
            'KeyInteract': 'Space',
            'KeyAnswer': 'Enter',
            'KeyTrap': 'Digit1',
            'KeyFlash': 'Digit2',
            'KeyHint': 'Digit3'
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

        var pseudoInput = { AA: 'AA 1-1', code: 'CDQE', name: 'Lets go' } // TODO
        this.network.joinGame(pseudoInput.AA, pseudoInput.code, pseudoInput.name);
    }

    resize() {
        var stageWidth = document.body.clientWidth;
        var stageHeight = document.body.clientHeight;

        this.grid = Math.round(Math.min(stageWidth / this.m, stageHeight / this.n));
        this.stageWidth = this.grid * this.m;
        this.stageHeight = this.grid * this.n;

        this.frame.width = this.stageWidth * this.pixelRatio;
        this.frame.height = this.stageHeight * this.pixelRatio;
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;

        console.log('frame', this.frame.width, this.frame.height);
        console.log('canvas', this.canvas.width, this.canvas.height);
        console.log('body', document.body.clientWidth, document.body.clientHeight, 'stage', this.stageWidth, this.stageHeight);

        // this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.map.resize(this.stageWidth, this.stageHeight, this.grid);
    }
}

window.onload = () => { new App(); }