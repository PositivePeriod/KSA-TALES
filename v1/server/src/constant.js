const MSG = Object.freeze({
    CONNECT_SERVER: 'connection',

    JOIN_PLAY: 'joinPlay',
    HANDLE_INPUT: 'handleInput',
    LEAVE_PLAY: 'leavePlay',

    JOIN_SPECTATE: 'joinSpectate',
    LEAVE_SPECTATE: 'joinSpectate',

    UPDATE_GAME: 'updateGame',

    DISCONNECT_SERVER: 'disconnect',
})

const AAtoCODE = Object.freeze({
    'AA1_1': 'CDQE',
    'AA1_2': 'DKRO',
    'AA2_1': 'CVPF'
})

const CODEtoAA = Object.freeze({
    'CDQE': 'AA1_1',
    'DKRO': 'AA1_2',
    'CVPF': 'AA2_1',
})

module.exports = {MSG, AAtoCODE, CODEtoAA}