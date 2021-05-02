const MSG = Object.freeze({
    CONNECT_SERVER: "connection",

    JOIN_PLAY: "joinPlay",
    HANDLE_INPUT: "handleInput",
    LEAVE_PLAY: "leavePlay",

    SEND_PROBLEM: "sendProblem",
    SEND_HINT: "sendHint",
    SEND_MESSAGE: "sendAchievement",
    SEND_LEADERBOARD: "sendLeaderboard",

    JOIN_SPECTATE: "joinSpectate",
    LEAVE_SPECTATE: "joinSpectate",

    UPDATE_GAME: "updateGame",

    DISCONNECT_SERVER: "disconnect",
});

const AAtoCODE = Object.freeze(new Map([
    ['AA1-1', 'JGCZ'],
    ['AA1-2', 'YWZK'],
    ['AA1-3', 'QLGJ'],
    ['AA1-4', 'JTTN'],
    ['AA1-5', 'GBDK'],
    ['AA1-6', 'IKEL'],
    ['AA1-7', 'ARQQ'],
    ['AA1-8', 'SRFR'],
    ['AA1-9', 'PFHY'],
    ['AA1-10', 'JRSM'],

    ['AA2-1', 'QIYH'],
    ['AA2-2', 'DLDL'],
    ['AA2-3', 'ZPKR'],
    ['AA2-4', 'LNBX'],
    ['AA2-5', 'PDME'],
    ['AA2-6', 'JVZI'],
    ['AA2-7', 'XFYA'],
    ['AA2-8', 'IZQG'],
    ['AA2-9', 'JALH'],

    ['AA3-1', 'GWQY'],
    ['AA3-2', 'XFJF'],
    ['AA3-3', 'QAIT'],
    ['AA3-4', 'SKTS'],
    ['AA3-5', 'UVHV'],
    ['AA3-6', 'SWEE'],
    ['AA3-7', 'SRQM'],
    ['AA3-8', 'VCHI'],
    ['AA3-9', 'RGHO'],

    ['RAA-1', 'OLEY'],
    ['RAA-2', 'IANN'],
    ['RAA-3', 'RFGF'],
    ['RAA-4', 'SCUF'],
    ['RAA-5', 'WJNO']
]));

var reverse = {};
for (let [key, value] of Object.entries(AAtoCODE)) {
    reverse[value] = key;
}
const CODEtoAA = Object.freeze(reverse);

const TRAPS = {
    0: { "id": "GBVS", "hint": "중강당 안쪽 문 앞", "answer": "6113" },
    1: { "id": "UNZV", "hint": "창조관 8층 하늘공원 의자 뒤", "answer": "9065" },
    2: { "id": "YVKT", "hint": "형설관 4층 eoz", "answer": "2657" },
    3: { "id": "IPQY", "hint": "형설 1층 도서관 사이 기둥", "answer": "0837" },
    4: { "id": "BHDI", "hint": "오작공원 옆 클라이밍 벽", "answer": "4305" },
    5: { "id": "VXSS", "hint": "상담실 앞", "answer": "1822" },
    6: { "id": "MBNT", "hint": "아크로폴리스 의자 뒤", "answer": "8839" },
    7: { "id": "JXDK", "hint": "운동장 운동기구", "answer": "9834" },
    8: { "id": "NRMC", "hint": "창조관 1층 엘리베이터 옆", "answer": "5820" },
    9: { "id": "YFAB", "hint": "시청각실 입구", "answer": "4786" }
}

const PROBLEMS = {
    "noblanks": { "hint": "noblanks", "answer": "428" },
    "convenience_store": { "hint": "CU", "answer": "SEVEN ELEVEN" },
    "identity_element": { "hint": "power", "answer": "1^111" },
    "addition": { "hint": "Python function", "answer": "SUMMARY" },
    "ans_in_problem": { "hint": "C=see", "answer": "LONG TIME NO SEE" },
    "anagram": { "hint": "ㅇㅂㅁㄹ", "answer": "일반물리" },
    "gugudan": { "hint": "lucky number", "answer": "11" },
    "blank": { "hint": "Special Character", "answer": "94" },
    "calculation": { "hint": "Use minus", "answer": "19" },
    "scientific_translation1": { "hint": "Let's translate in English", "answer": "17.8.10" },
    "scientific_translation2_1": { "hint": "Chemistry", "answer": "cafe" },
    "scientific_translation2_2": { "hint": "Chemistry", "answer": "life" },
    "school_geography": { "hint": "Where is 대강당?", "answer": "1212" },
    "ancient_china": { "hint": "Chinese character", "answer": "5" },
    "position_change": { "hint": "Parallel Translation", "answer": "EFFECT" },
    "Bomb": { "hint": "3*3", "answer": "SONG" },
    "Zigzag": { "hint": "Color", "answer": "1221" },
    "AAA": { "hint": "Addition", "answer": "406" },
    "guessing_word": { "hint": "1st character is M", "answer": "MESSAGE" },
    "mugcup": { "hint": "Pay attention to the direction of handle", "answer": "FORTUNE FAVORS THE BRAVE" },
    "keypad": { "hint": "folder phone", "answer": "들어가면 죽어" },
    "color": { "hint": "The colors are important", "answer": "lineate" },
    "formula_conversion": { "hint": "Sqaure", "answer": "10" },
    "pyramid": { "hint": "Set the blanks in the fourth row below to x,y,z", "answer": "282" },
    "USB": { "hint": "USC", "answer": "USB" },
    "integral": { "hint": "적분", "answer": "2" },
    "variable": { "hint": "answer", "answer": "15308" },
    "arrangement": { "hint": "Home Alone", "answer": "H" },
    "password": { "hint": "Push", "answer": "CURSE" },
    "number": { "hint": "Move the lines", "answer": "window" },
    "nucleotide": { "hint": "transfer each line parallel", "answer": "Cytosin" }
};

module.exports = { MSG, AAtoCODE, CODEtoAA, PROBLEMS, TRAPS };