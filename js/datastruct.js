
// DICHIARAZIONI DATI COSTANTI

const TETRA_T = "T"; // tipi di tetramini
const TETRA_L = "L";
const TETRA_J = "J";
const TETRA_I = "I";
const TETRA_O = "O";
const TETRA_S = "S";
const TETRA_Z = "Z";

const arrayTipiTetramini = [
    TETRA_I,
    TETRA_S,
    TETRA_Z, 
    TETRA_L,
    TETRA_J,
    TETRA_O,
    TETRA_T
];

const BOARDCOLUMNS = 10;
const BOARDROWS = 22;
const BOARDHIDDENROWS = 2;
const INIT_INTERVAL_DURATION = 450;

const LVL_STEP = 27; // differenza di velocità tra un livello e un altro (ms)

const TO_NEXT_LEVEL = 5; // linee da ripulire prima di arrivare al livello successivo
const MAX_LEVEL = 15;

const PTS_TETRIS = 800;
const PTS_TRIPLE = 500;
const PTS_DOUBLE = 300;
const PTS_SINGLE = 100;
const PTS_HARD_DROP_MULT = 10;
const PTS_SOFT_DROP_MULT = 5;

const MOVEMENT_SPEED = 50;
// posizione dei tetramini (relative)
const POSIZIONI_TETRAMINI = {
    // contiene anche le posizioni relative alle rotazioni
    "I": [
            [[0, 0], [0, 1], [0, 2], [0, 3]], // stato iniziale 
            [[-1, 2], [0, 2], [1, 2], [2, 2]],
            [[1, 0], [1, 1], [1, 2], [1, 3]],
            [[-1, 1], [0, 1], [1, 1], [2, 1]]
         ],
    "L": [ 
            [[1, 1], [1, 0], [1, 2], [0, 2]], // stato iniziale 
            [[1, 1], [0, 1], [2, 1], [2, 2]],
            [[1, 1], [1, 0], [1, 2], [2, 0]],
            [[1, 1], [0, 1], [0, 0], [2, 1]]
         ],
        
    "J": [
            [[1, 1], [1, 0], [1, 2], [0, 0]], // stato iniziale 
            [[1, 1], [0, 1], [2, 1], [0, 2]],
            [[1, 1], [1, 0], [1, 2], [2, 2]],
            [[1, 1], [0, 1], [2, 1], [2, 0]]
         ],
    "T": [
            [[1, 1], [0, 1], [1, 2], [1, 0]], // stato iniziale 
            [[1, 1], [0, 1], [2, 1], [1, 2]],
            [[1, 1], [1, 0], [1, 2], [2, 1]],
            [[1, 1], [1, 0], [0, 1], [2, 1]]
         ], 
    "O": [
            [[0, 0], [0, 1], [1, 0], [1, 1]], // stato iniziale 
            [[0, 0], [0, 1], [1, 0], [1, 1]],
            [[0, 0], [0, 1], [1, 0], [1, 1]],
            [[0, 0], [0, 1], [1, 0], [1, 1]],
    ],
    "S": [
            [[1, 1], [0, 2], [1, 0], [0, 1]], // stato iniziale 
            [[1, 1], [0, 1], [1, 2], [2, 2]],
            [[1, 1], [2, 0], [2, 1], [1, 2]],
            [[1, 1], [0, 0], [1, 0], [2, 1]]
    ],
    "Z": [
            [[1, 1], [0, 1], [0, 0], [1, 2]], // stato iniziale 
            [[1, 1], [0, 2], [1, 2], [2, 1]],
            [[1, 1], [1, 0], [2, 1], [2, 2]],
            [[1, 1], [0, 1], [1, 0], [2, 0]]
    ]
};
const STATUS_SCONFITTA = "StatusSconfitta"
const STATUS_NUOVO_LIVELLO = "StatusNuovoLivello"

// DICHIARAZIONE OGGETTI GLOBALI
const SevenBag = { 
    tipoProssimo: null, 
    tipoCorrente: null,
    currTetra_ind: null,
    codaTetramini: []
}

// gameObj
const Game = {
    tetramino : [ 
        {riga: null, colonna: null},
        {riga: null, colonna: null},
        {riga: null, colonna: null},
        {riga: null, colonna: null}
    ],
    cellArray: [],
    previewArray: [],
    holdArray: [],
    tetraminoInHold: null,
    holdAllowed : true,
    hardDropped: false,
    intervalId: null,
    moveIntervalId: null,
    intervalDuration: INIT_INTERVAL_DURATION,
    lineeLiberate: 0,
    punti: 0,
    livello: 1,
    statoRotazione: null,
}
const PostInfo = {
    postSent: false
};

// indica se i tasti sono premuti
const KeyState = 
{
    SDown : false,
    WDown : false,
    ADown : false,
    DDown : false,
    EnterDown: false
}