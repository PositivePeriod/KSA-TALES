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

const AAtoCODE = Object.freeze({
    "AA 1-1": "CDQE",
    "AA 1-2": "DKRO",
    "AA 2-1": "CVPF"
});

var reverse = {};
for (let [key, value] of Object.entries(AAtoCODE)) {
    reverse[value] = key;
}
const CODEtoAA = Object.freeze(reverse);

const PROBLEMS = {
    "noblanks": { "hint": "noblanks", "answer": 428 },
    "convenience_store": {"hint": "편의점", "answer": "SEVEN ELEVEN" },
    "identity_element": { "hint": "항등원", "answer": ["1^111", "1*111"], "type": "or" },
    "addition": { "hint": "파이썬 함수", "answer": "SUMMARY" },
    "ans_in_problem": { "hint": "C=see", "answer": "LONG TIME NO SEE" },
    "anagram": { "hint": "ㅇㅂㅁㄹ", "answer": "일반물리" },
    "gugudan": { "hint": "lucky number", "answer": 11 },
    "blank": { "hint": "특수문자", "answer": 94 },
    "calculation": { "hint": "빼기를 활용하자", "answer": 19 },
    "scientific_translation1": { "hint": "영어로 번역해보자", "answer": "17.8.10" },
    "scientific_translation2_1": { "hint": "화학", "answer": "cafe" },
    "scientific_translation2_2": { "hint": "화학", "answer": "life" },
    "school_geography": { "hint": "대강당은 몇호일까", "answer": 1212 },
    "ancient_china": { "hint": "한자", "answer": 5 },
    "position_change": { "hint": "평행이동", "answer": "EFFECT" },
    "Bomb": { "hint": "3*3", "answer": "SONG" },
    "Zigzag": { "hint": "색깔", "answer": "TO ENTER TAKE A PICTURE QR CODE NOBEL TREE" },
    "AAA": { "hint": "덧셈", "answer": 406 },
    "guessing_word": { "hint": "1번째 글자는 M이다", "answer": "MESSAGE" },
    "mugcup": { "hint": "손잡이의 방향에 주목하라", "answer": "FORTUNE FAVORS THE BRAVE" },
    "keypad": { "hint": "폴더폰", "answer": "들어가면 죽어" },
    "cross_word_puzzle": { "hint": null, "answer": {1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:'',9:'',10:'' } },
    "formula_conversion": { "hint": "제곱", "answer": 10 },
    "pyramid": { "hint": "아래에서 네 번째 행의 빈칸을 x,y,z로 설정한다", "answer": 282 },
    "annual": { "hint": null, "answer": ["3월 26일 17시 48분 59초", "9월 28일 17시 56분 43초"], "type": "and" },
    "four_character_idioms": { "hint": null, "answer": "확인필요" },
    "variable": { "hint": "그냥 푸세요 =D", "answer": {"A":9876, "B":5432} },
    "arrangement": { "hint": null, "answer": "H" },
    "password": { "hint": "밀자", "answer": "CURSE" },
    "number": { "hint": "영어로", "answer": 3 },
};

module.exports = { MSG, AAtoCODE, CODEtoAA, PROBLEMS};