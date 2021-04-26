const path = require('path');
const express = require('express');
const socketio = require('socket.io')
// const mainRouter = require(`./${version}/src/mainRouter`);
// const problemRouter = require(`./${version}/src/problemRouter`);

// app.set('views', path.join(__dirname, `${version}/views`));
// app.set('view-engine', 'ejs');

// app.use('/problem', problemRouter);
// app.use('/', mainRouter)

const MSG = Object.freeze({
    CONNECT_SERVER: 'connectServer',
    JOIN_GAME: 'joinGame',
    UPDATE_GAME: 'updateGame',
    LEAVE_GAME: 'leaveGame',
    HANDLE_INPUT: 'handleInput',
    DISCONNECT_SERVER: 'disconnectServer',
})

const PW = Object.freeze({
    AA1_1: 'CDQE',
    AA1_2: 'DKRO',
    AA2_1: 'CVPF'
})

class ServerManager {
    constructor() {
        this.game = new Game();
        this.socketList = {};

        this.app = express();
        this.app.use('/assets', express.static(path.join(__dirname, `/assets`)));
        this.start();
    }

    start() {
        const port = process.env.PORT || 3000;
        this.server = this.app.listen(port, function() {
            console.log(`KSA-TALES listening on port ${port}`);
            this.initializeSocket();
        }.bind(this));
    }

    initializeSocket() {
        this.io = socketio(this.server);
        this.io.on(MSG.CONNECT_SERVER, socket => {
            socket.emit(MSG.CONNECT_SERVER, socket.id);
            this.socketList[socket.id]= socket;

            // this === socket
            socket.on(MSG.JOIN_GAME, joinGame);
            socket.on(MSG.UPDATE_GAME, updateGame);
            socket.on(MSG.LEAVE_GAME, leaveGame);
            socket.on(MSG.HANDLE_INPUT, handleInput)
            socket.on(MSG.DISCONNECT_SERVER, disconnect);
        });

        function joinGame(data) {
            // console.log(`Account join room ; ${socket.id} ${room.id}`);
            var socket = this;
            var name = data.userID;
            var password = data.userPW;
            if (PW[name] === password){
                this.game.addPlayer(socket, name); // TODO 
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

var gameServer = new ServerManager(game);