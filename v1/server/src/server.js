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
        this.game = new Game();
        this.socketList = {};
        this.playSocket = {}; // TODO
        this.spectateSocket = {}; // TODO

        this.app = express();
        this.route();
        this.start();
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
        // this.app.get('/play', function(req, res) {
        //     res.send("Nice try but dont you think it is too obvious? :(");
        // });
        this.app.get('/spectate', function(req, res) {
            res.send("spectate");
        });

        this.app.use('/play', express.static(path.join(__dirname, `../../../${version}/client/player`)));
        this.app.use('/assets', express.static(path.join(__dirname, `../assets`)));

        this.app.use(function(req, res, next) {
            res.status(404).send('Sorry cant find that!');
        });

    }

    start() {
        const port = process.env.PORT || 8000;
        this.server = this.app.listen(port, function() {
            console.log(`KSA-TALES listening on port ${port}`);
            this.initializeSocket();
        }.bind(this));
    }

    initializeSocket() {
        this.io = socketio(this.server);
        console.log('initialize Socket');
        this.io.on(MSG.CONNECT_SERVER, socket => {
            console.log(`CONNECT server | ${socket.id}`);
            
            socket.emit(MSG.CONNECT_SERVER, socket.id);
            this.socketList[socket.id] = socket;

            // this === socket
            socket.on(MSG.JOIN_PLAY, joinPlay);
            socket.on(MSG.UPDATE_GAME, updateGame);
            socket.on(MSG.LEAVE_PLAY, leaveGame);

            socket.on(MSG.JOIN_SPECTATE, null); // TODO
            socket.on(MSG.LEAVE_SPECTATE, null); // TODO

            socket.on(MSG.HANDLE_INPUT, handleInput)

            socket.on(MSG.DISCONNECT_SERVER, disconnect);
        });

        function joinPlay(data) {
            var socket = this;
            console.log(`Account join room ; ${socket.id}`);
            var AA = data.AA;
            var code = data.CODE;
            var playerName = data.name;
            if (AAtoCODE[AA] === code) {
                this.game.addPlayer(socket, AA, playerName); // TODO 
            }
        }

        function updateGame() {
            // client가 server에 요청? // TODO

            // TODO 없애도 되나?
        }

        function leaveGame() {
            var socket = this;
            this.game.removePlayer(socket);
        }

        function handleInput(data) {
            // console.log(`Get command ; ${id}`);
            var socket = this;
            var command = data.command;
            game.handleInput(socket, command);
        }

        function disconnect() {
            var socket = this;
            delete this.socketList[socket.id];
        }
    }
}

var server = new ServerManager();