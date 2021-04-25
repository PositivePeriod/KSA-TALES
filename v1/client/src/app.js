import {
    Player
} from './player.js';
import {
    Map
} from './map.js'

class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.map = new Map(this.stageWidth, this.stageHeight, 10, 10, this.load());
        this.player = new Player(0, 0, this.map);

        window.addEventListener('resize', this.resize.bind(this), false);
        window.addEventListener('keydown', this.key.bind(this), false);

        setTimeout(function () {
            this.resize();
        }.bind(this), 1000)
    }<script src="/socket.io/socket.io.js"></script>
    <script>
      const socket = io();
    </script>

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.map.resize(this.stageWidth, this.stageHeight);
        this.player.resize();

        this.draw();
    }

    key(e) {
        console.log(e)
        if (e.key === 'ArrowLeft') {
            this.player.move([-1, 0]);
        } else if (e.key === 'ArrowUp') {
            this.player.move([0, -1]);
        } else if (e.key === 'ArrowRight') {
            this.player.move([1, 0]);
        } else if (e.key === 'ArrowDown') {
            this.player.move([0, 1]);
        }
        this.draw()
    }

    draw() {
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        this.map.draw(this.ctx);
        this.player.draw(this.ctx);
    }

    load() {
        return new Promise(function (resolve, reject) {
            $.get('./data/map_data.txt', function (data) {
                resolve(data);
            }, 'text')
        });
    }

}

window.onload = () => {
    new App();
}