const MSG = Object.freeze({
    CONNECT_SERVER: "connection",

    JOIN_PLAY: "joinPlay",
    HANDLE_INPUT: "handleInput",
    LEAVE_PLAY: "leavePlay",

    SEND_PROBLEM: "sendProblem",
    SEND_HINT: "sendHint",
    SEND_ACHIEVEMENT: "sendAchievement",

    JOIN_SPECTATE: "joinSpectate",
    LEAVE_SPECTATE: "joinSpectate",

    UPDATE_GAME: "updateGame",

    DISCONNECT_SERVER: "disconnect",
});

const AAtoCODE = Object.freeze(new Map([
    ["AA1_1", "CDQE"],
    ["AA1_2", "DKRO"],
    ["AA1_3", "CVPF"],
    ["AA1_4", "CDQE"],
    ["AA1_5", "IOPP"],
    ["AA2_6", "JJOK"],
    ["AA1_7", "HOKO"],
    ["AA1_9", "OHGI"],
    ["AA2_10", "RUYI"],
    ["AA1_11", "CDQE"],
    ["AA1_12", "DKRO"],
]));

var reverse = {};
for (let [key, value] of Object.entries(AAtoCODE)) {
    reverse[value] = key;
}
const CODEtoAA = Object.freeze(reverse);

const PROBLEMS = {
    "noblanks": { "hint": "noblanks", "answer": "428" },
    "convenience_store": { "hint": "CU", "answer": "SEVEN ELEVEN" },
    "identity_element": { "hint": "power", "answer": "1^111"},
    "addition": { "hint": "Python function", "answer": "SUMMARY" },
    "ans_in_problem": { "hint": "C=see", "answer": "LONG TIME NO SEE" },
    "anagram": { "hint": "ㅇㅂㅁㄹ", "answer": "일반물리" },
    "gugudan": { "hint": "lucky number", "answer": "11" },
    "blank": { "hint": "Special Character / 특수문자", "answer": "94" },
    "calculation": { "hint": "Use minus", "answer": "19" },
    "scientific_translation1": { "hint": "영어로 번역해보자", "answer": "17.8.10" },
    "scientific_translation2_1": { "hint": "화학", "answer": "cafe" },
    "scientific_translation2_2": { "hint": "화학", "answer": "life" },
    "school_geography": { "hint": "Where is 대강당?", "answer": "1212" },
    "ancient_china": { "hint": "Chinese character", "answer": "5" },
    "position_change": { "hint": "Parallel Translation", "answer": "EFFECT" },
    "Bomb": { "hint": "3*3", "answer": "SONG" },
    "Zigzag": { "hint": "Color", "answer": "TO ENTER TAKE A PICTURE QR CODE NOBEL TREE" }, // TODO ?? QR code 암호가 답이 되어야 하는 거 아님?
    "AAA": { "hint": "Addition", "answer": "406" },
    "guessing_word": { "hint": "1st character is M", "answer": "MESSAGE" },
    "mugcup": { "hint": "손잡이의 방향에 주목하라", "answer": "FORTUNE FAVORS THE BRAVE" },
    "keypad": { "hint": "폴더폰", "answer": "들어가면 죽어" },
    "cross_word_puzzle": { "hint": null, "answer": { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: '' } }, // TODO 답 여러개
    "formula_conversion": { "hint": "제곱", "answer": "10" },
    "pyramid": { "hint": "아래에서 네 번째 행의 빈칸을 x,y,z로 설정한다", "answer": "282" },
    "annual": { "hint": null, "answer": ["3월 26일 17시 48분 59초", "9월 28일 17시 56분 43초"], "type": "and" }, // 여러 개
    "four_character_idioms": { "hint": null, "answer": "확인필요" },
    "variable": { "hint": "그냥 푸세요 =D", "answer": { "A": 9876, "B": 5432 } }, // 답 여러개
    "arrangement": { "hint": "나홀로 집에", "answer": "H" },
    "password": { "hint": "밀자", "answer": "CURSE" },
    "number": { "hint": "영어로", "answer": "3" },
    "nucleotide": {"hint": "각각의 선을 평행이동", "answer": "Cytosin"}
};

module.exports = { MSG, AAtoCODE, CODEtoAA, PROBLEMS };