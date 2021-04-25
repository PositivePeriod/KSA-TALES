import io from 'socket.io-client';
import { processGameUpdate } from './render';
import { createDisconnectGame } from './wait-game';
const { MSG_TYPES } = require('../shared/constants');

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });

const connectedPromise = new Promise(resolve => {
    socket.on('connect', () => {
        console.info('Connected to server');
        resolve();
    });
});

export const connect = gameOverCallback => (
    connectedPromise.then(() => {
        socket.on(MSG_TYPES.GAME_UPDATE, processGameUpdate);
        socket.on(MSG_TYPES.GAME_OVER, gameOverCallback);
        socket.on('disconnect', disconnectFromServer);
    })
);

export const play = username => {
    console.info(`Join game as ${username}`);
    socket.emit(MSG_TYPES.JOIN_GAME, username);
};

export const updateCommand = command => {
    if (command !== null) {
        console.info(`Input | `, command);
        socket.emit(MSG_TYPES.INPUT, command);
    }
};

function disconnectFromServer() {
    console.info('Disconnected from server.');
    //
    createDisconnectGame();
}

window.onbeforeunload = function() {
    socket.emit('disconnect');
    delete e['returnValue'];
    return "저장되지 않은 변경사항이 있습니다. 정말 페이지를 떠나실 건 가요?";
};