const path = require('path');
const fs = require('fs');
const express = require('express');
const socketio = require('socket.io');
const { MSG, AAtoCODE } = require('./constant');
const Game = require('./entity/gameObject');
const cors = require('cors');

const version = 'v1';

class ServerManager {
    constructor() {
        this.game = new Game();

        this.app = express();
        this.app.use(cors());
        this.route();

        const port = process.env.PORT || 8000;
        this.server = this.app.listen(port, function() {
            console.log(`Labyrinth : UNDER THE KSA listening on port ${port}`);
        }.bind(this));

        this.makeSocket();
    }

    route() {
        this.app.set('views', path.join(__dirname, `../../../${version}/server/views`));
        this.app.set('view-engine', 'ejs');

        this.app.use('/about', function(req, res) { res.sendFile(path.join(__dirname, '../public/about.html')); });
        this.app.use('/leaderboard', function(req, res) { res.sendFile(path.join(__dirname, '../public/leaderboard.html')); });

        this.app.get('/develop/problems/:id', function(req, res) {
            var id = req.params.id;
            const data = {
                title: id,
                body: fs.readFileSync(path.resolve(__dirname, `../views/problems/${id}.html`), 'utf8')
            };
            res.render('problem.ejs', data);
        });

        this.app.get('/problems/:id', function(req, res) {
            res.sendFile(path.join(__dirname, `../views/problems/${req.params.id}.html`))
        });

        this.app.get('/register/play/:AA/:code/:name', function(req, res) {
            const AA = req.params.AA;
            const code = req.params.code;
            const name = req.params.name;
            console.log(AA, code, AAtoCODE.get(AA));
            if (AAtoCODE.get(AA) === code) {
                res.redirect(`/play/${AA}/${code}/${name}`);
            } else {
                res.redirect(`/register`);
            }
        });

        this.app.get('/register/spectate/:AA/:code', function(req, res, next) {
            const AA = req.params.AA;
            const code = req.params.code;
            if (AAtoCODE.get(AA) === code) {
                res.redirect(`/spectate/${AA}/${code}`);
            } else {
                res.redirect(`/register`);
            }
        });

        this.app.use('/register', function(req, res) { res.sendFile(path.join(__dirname, '../public/register.html')); });
        this.app.use('/help', function(req, res) { res.sendFile(path.join(__dirname, '../public/help.html')); });
        this.app.use('/cheat', function(req, res) { res.sendFile(path.join(__dirname, '../public/cheat.html')); });

        this.app.use('/play', function(req, res) { res.sendFile(path.join(__dirname, `../../../${version}/client/player/index.html`)); });
        this.app.use('/spectate', function(req, res) { res.sendFile(path.join(__dirname, `../../../${version}/client/spectate/index.html`)); });
        // this.app.use('/spectate', express.static(path.join(__dirname, `../../../${version}/client/spectator`)));
        this.app.get('/spectate', function(req, res) { res.send("spectate"); });

        this.app.use('/assets/play', express.static(path.join(__dirname, `../../../${version}/client/player`)));
        this.app.use('/', express.static(path.join(__dirname, `../public`)));

        this.app.use((req, res, next) => { res.sendFile(path.join(__dirname, '../public/404.html')); });
    }

    makeSocket() {
        this.io = socketio(this.server);
        this.game.io = this.io;
        this.io.on(MSG.CONNECT_SERVER, (socket) => {
            console.log(`${socket.id} | Connect Server`);
            this.game.sockets[socket.id] = socket;

            socket.on(MSG.JOIN_PLAY, this.joinPlay.bind(this, socket));

            socket.on(MSG.LEAVE_PLAY, this.leaveGame.bind(this, socket));

            // socket.on(MSG.JOIN_SPECTATE, ); // TODO
            // socket.on(MSG.LEAVE_SPECTATE, ); // TODO

            socket.on(MSG.HANDLE_INPUT, this.handleInput.bind(this, socket));

            // socket.on(MSG.SEND_ANSWER, this.getAnswer.bind(this, socket));

            socket.on(MSG.DISCONNECT_SERVER, this.disconnect.bind(this, socket));
        });
    }

    joinPlay(socket, data) {
        var AA = data.AA;
        var code = data.code;
        var playerName = data.name;
        if (AAtoCODE.has(AA) && AAtoCODE.get(AA) === code && (!this.game.joinedAA.has(AA))) {
            console.log(`${socket.id} | Join Room Success`);
            this.game.addPlayer(socket, AA, playerName); // TODO 한 반 당 한 명만
        } else {
            console.log(`${socket.id} | Join Room Failure`);
            socket.emit(MSG.JOIN_PLAY, null);
        }
    }

    leaveGame() {
        this.game.removePlayer(socket);
    }

    handleInput(socket, command) {
        // console.log(`${this.game.players.get(socket.id).AA} | Handle Input`);
        if (this.game.players.has(socket.id)) {
            var commandQueue = this.game.players.get(socket.id).commandQueue;
            if (commandQueue.getSize() < 1) {
                commandQueue.push(command);
            }
        }
    }

    disconnect(socket) {
        console.log(`${socket.id} | Disconnect`);
        this.game.removePlayer(socket.id);
    }
}

new ServerManager(); {

}