const MSG = Object.freeze({
    CONNECT_SERVER: 'connection',

    JOIN_PLAY: 'joinPlay',
    HANDLE_INPUT: 'handleInput',
    LEAVE_PLAY: 'leavePlay',

    SEND_PROBLEM: 'sendProblem',
    SEND_HINT: 'sendHint',
    SEND_ACHIEVEMENT: 'sendAchievement',

    JOIN_SPECTATE: 'joinSpectate',
    LEAVE_SPECTATE: 'joinSpectate',

    UPDATE_GAME: 'updateGame',

    DISCONNECT_SERVER: 'disconnect',
});

const AAtoCODE = Object.freeze({
    'AA 1-1': 'CDQE',
    'AA 1-2': 'DKRO',
    'AA 2-1': 'CVPF'
});

var reverse = {};
for (let [key, value] of Object.entries(AAtoCODE)) {
    reverse[value] = key;
}
const CODEtoAA = Object.freeze(reverse);

module.exports = { MSG, AAtoCODE, CODEtoAA };