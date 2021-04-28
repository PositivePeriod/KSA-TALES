const path = require('path');
const fs = require('fs');
const express = require('express');
const socketio = require('socket.io');
const { MSG, AAtoCODE } = require('./constant');
const Game = require('./entity/gameObject');

// const mainRouter = require(`./${version}/src/mainRouter`);
// const problemRouter = require(`./${version}/src/problemRouter`);

// app.set('views', path.join(__dirname, `${version}/views`));
// app.set('view-engine', 'ejs');

// app.use('/problem', problemRouter);
// app.use('/', mainRouter)

const version = 'v1';

class ServerManager {
    constructor() {
        this.game = new Game(this);

        this.app = express();
        this.route();

        const port = process.env.PORT || 8000;
        this.server = this.app.listen(port, function() {
            console.log(`KSA Labyrinth : UNDER THE KSA listening on port ${port}`);
        }.bind(this));

        this.makeSocket();
    }

    route() {
        this.app.set('views', path.join(__dirname, `../../../${version}/server/views`));
        this.app.set('view-engine', 'ejs');

        this.app.get('/', function(req, res) {
            const data = {
                title: 'MAIN',
                body: fs.readFileSync(path.resolve(__dirname, '../views/body/main.html'), 'utf8')
            }
            res.render('template.ejs', data);
        });

        this.app.get('/favicon.ico', function(req, res) {
            res.sendFile(path.join(__dirname, '../assets/favicon.ico'));
        });
        this.app.get('/about', function(req, res) {
            res.send('Who made the site? By KSA STUDENTS!');
        });
        this.app.get('/leaderboard', function(req, res) {
            res.send('Take a look! LEADER BOARD Go for it! Beat other teams :)');
        });
        this.app.get('/easteregg', function(req, res) {
            res.send("Nice try but dont you think it is too obvious? :(");
        });
        this.app.get('/spectate', function(req, res) {
            res.send("spectate");
        });

        this.app.use('/play', express.static(path.join(__dirname, `../../../${version}/client/player`)));
        // this.app.use('/spectate', express.static(path.join(__dirname, `../../../${version}/client/spectator`)));
        this.app.use('/assets', express.static(path.join(__dirname, `../assets`)));
        this.app.use('/play/assets', express.static(path.join(__dirname, `../problems`)));

        this.app.use(function(req, res, next) {
            res.status(404).send('Sorry cant find that!');
        });

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
        if (AAtoCODE[AA] === code) {
            console.log(`${socket.id} | Join Room Success`);
            this.game.addPlayer(socket, AA, playerName); // TODO 한 반 당 한 명만
        } else {
            console.log(`${socket.id} | Join Room Failure`);
        }
    }

    leaveGame() {
        this.game.removePlayer(socket);
    }

    handleInput(socket, command) {
        console.log(`${socket.id} | Handle Input`);
        this.game.players[socket.id].commandQueue.push(command);
    }

    disconnect(socket) {
        console.log(`${socket.id} | Disconnect`);
        delete this.game.sockets[socket.id];
    }
}

var server = new ServerManager();