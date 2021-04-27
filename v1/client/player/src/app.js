import { Network } from './util/network.js';
import { KeyboardManager } from './util/inputManager.js';
import { MapObject } from './entity/mapObject.js';

class App {
    constructor() {
        this.showRange = { width: 5, height: 3 };

        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        var m = 2 * this.showRange.width + 1;
        var n = 2 * this.showRange.height + 1;
        this.map = new MapObject(this.stageWidth, this.stageHeight, m, n);

        this.keyboard = new KeyboardManager();
        this.keyboard.activate();

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        this.network = new Network();
        this.network.connect();
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
        this.map.draw(this.ctx);
        this.player.draw(this.ctx);
    }
}

window.onload = () => { new App(); }