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
    LEAVE_GAME: 'leaveGame',
    DISCONNECT_SERVER: 'disconnectServer',
})

class ServerManager {
    constructor() {
        this.socketList = [];

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
            console.log(`Account connect ; ${socket.id}`);
            socket.emit(MSG.CONNECT_SERVER, socket.id);
            this.socketList.set(socket.id, socket);

            // this === socket
            socket.on(MSG.JOIN_GAME, joinGame);
            socket.on(MSG.UPDATE_GAME, updateGame);
            socket.on(MSG.LEAVE_GAME, leaveGame);
            socket.on(MSG.HANDLE_INPUT, handleInput)
            socket.on(MSG.DISCONNECT_SERVER, disconnect);
        });

        function joinGame() {
            console.log(`Account join room ; ${this.id} ${room.id}`);
            game.tryToAddPlayer.push([this, username]); // TODO 
        }

        function updateGame() {

        }

        function leaveGame() {

        }
        
        function handleInput(data) {
            console.log(`Get command ; ${id}`);
            game.handleInput(this, command);
        }

        function disconnect() {
            console.log(`Account disconnect ; ${this.id}`);
            socketList.delete(this.id);
        }
    }
}

var gameServer = new ServerManager();