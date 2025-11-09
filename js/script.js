document.addEventListener("DOMContentLoaded", generateBoard);
document.addEventListener("DOMContentLoaded", generatePreview);
document.addEventListener("DOMContentLoaded", generateHold);

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
    statoRotazione: null
}


// indica se i tasti sono premuti
const KeyState = 
{
    SDown : false,
    WDown : false,
    ADown : false,
    DDown : false,
    EnterDown: false
}

function isInBound(r, c)
{
    return (r < BOARDROWS && r >= 0 && c < BOARDCOLUMNS && c >= 0);
}

function getCell(row, col)
{
    return Game.cellArray[row][col];
}

// Algoritmo 7-bag
function tetraminoCasuale()
{
    let nuovoIndice = (SevenBag.currTetra_ind + 1) % 14;
    if(nuovoIndice === 0)
    {
        shuffle(SevenBag.codaTetramini, 7, 13);
        console.log("[tetraminoCasuale] shuffle: ", SevenBag.codaTetramini);
    }
    if(nuovoIndice === 7)
    {
        shuffle(SevenBag.codaTetramini, 0, 6);
        console.log("[tetraminoCasuale] shuffle: ", SevenBag.codaTetramini);
    }
    SevenBag.currTetra_ind = nuovoIndice;
    return SevenBag.codaTetramini[nuovoIndice];
}

function coloraCella(row, col, color)
{
    getCell(row, col).classList.add(color);
}

function coloraTetra(tetra, tipo)
{
    for(e of tetra)
    {
        coloraCella(e.riga, e.colonna, tipo);
    }
}

function svuotaCella(row, col)
{
    getCell(row, col).className = "cell";
}

function toggleInMovimento(row, col)
{
    getCell(row, col).classList.toggle("inMovimento");
}

function killTetra()
{
    for (let i of Game.tetramino)
    {
        svuotaCella(i.riga, i.colonna);
    }
}

function bloccaTetra(t)
{
    for (c of t)
    {
        if(c.riga == BOARDHIDDENROWS)
        { // caso sconfitta
            scriviStatus("Hai perso :(", STATUS_SCONFITTA);
            terminaPartita();
        }
        getCell(c.riga, c.colonna).classList.remove("inMovimento");
        getCell(c.riga, c.colonna).classList.add("Caduto"); // serve alla collision detection
    }
    Game.holdAllowed = true;
    // todo timeout intervalDuration+10ms per dare tempo di muoversi e poi riparte 
}

function scriviStatus(msg, color)
{
    if(color !== "")
    {
        document.getElementById("Status").className = color;
    }
    document.getElementById("Status").innerText = msg;
}

function pulisciBoard(brd)
{
    for(let i = 0; i < brd.length; i++)
    {
        for(let j = 0; j < brd[0].length; j++)
        {
            brd[i][j].className = "cell";
        }
    }
}

function scriviHold(tipo)
{
    const coordinate = POSIZIONI_TETRAMINI[tipo][0];
    for(let i = 0; i < 4; i++)
    {
        let r, c;
        switch(tipo)
        {
            case TETRA_I: 
                r = coordinate[i][0] + 1;
                c = coordinate[i][1];
            break;
            default:
                r = coordinate[i][0] + 1;
                c = coordinate[i][1] + 1;
        }
        Game.holdArray[r][c].classList.add(tipo);
    }
}

function scriviPreview(tipo)
{
    const coordinate = POSIZIONI_TETRAMINI[tipo][0];
    for(let i = 0; i < 4; i++)
    {
        let r, c;
        switch(tipo)
        {
            case TETRA_I: 
                r = coordinate[i][0] + 1;
                c = coordinate[i][1];
            break;
            default:
                r = coordinate[i][0] + 1;
                c = coordinate[i][1] + 1;
        }
        Game.previewArray[r][c].classList.add(tipo);
    }
}

// non si preoccupa di preview, tipoPossimo
function nuovoTetramino(tipo)
{
    SevenBag.tipoCorrente = tipo;
    Game.statoRotazione = 0;
    const coordinate = POSIZIONI_TETRAMINI[tipo][Game.statoRotazione];
    for(let i = 0; i < 4; i++)
    {
        Game.tetramino[i].riga = coordinate[i][0];
        if(tipo === TETRA_O)
        {
        Game.tetramino[i].colonna = coordinate[i][1] + 4;
        }
        else
        {
            Game.tetramino[i].colonna = coordinate[i][1] + 3;
        }
        if(getCell(Game.tetramino[i].riga, Game.tetramino[i].colonna).classList.contains("caduto"))
        {
            terminaPartita();
            return;
        }
        toggleInMovimento(Game.tetramino[i].riga, Game.tetramino[i].colonna);
    }
    for (let sqr of Game.tetramino)
    {
        coloraCella(sqr.riga, sqr.colonna, tipo);
    }
}

// mescola gli elementi di a, da ini a fin
// (algoritmo 7-bag)
function shuffle(a, ini, fin)
{
    for(let i = fin - 1; i >= ini; i--)
    {
        let aux = ini + Math.floor(Math.random() * (i - ini + 1));
        // scambio elemento i-esimo con elemento casuale
        [a[i], a[aux]] = [a[aux], a[i]]; 
    }
}

function generateBoard()
{
    document.getElementById("Start").addEventListener("click", startGame);
    document.getElementById("Restart").classList.add("Nascosto");
    document.getElementById("Restart").addEventListener("click", ()=> {
            document.getElementById("Restart").classList.add("Nascosto");
            document.getElementById("Restart").blur();
            terminaPartita();
            startGame();
        });
    for(let i = 0; i < 14; i++)
    {
        SevenBag.codaTetramini.push(arrayTipiTetramini[i%7]);
    }
    shuffle(SevenBag.codaTetramini, 0, 6);
    shuffle(SevenBag.codaTetramini, 7, 13);
    SevenBag.currTetra_ind = 0;

    board = document.getElementById("gameBoard");
    for(let i = 0; i < BOARDROWS; i++)
    {
        const cellArrRow = [];
        row = document.createElement("div");
        row.classList.add("row");
        if(i < BOARDHIDDENROWS)
        {
            row.classList.add("Nascosto"); // righe sopra nascoste
        }
        board.appendChild(row);
        for(let j = 0; j < BOARDCOLUMNS; j++)
        {
            cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = `cell-${i}-${j}`;
            cellArrRow.push(cell);
            row.appendChild(cell);
        }
        Game.cellArray.push(cellArrRow);
    }
}
function generatePreview(){
    // genero la cella di preview
    let previewSquare = document.getElementById("Preview");
    for (let i = 0; i < 4; i++)
    {
        let previewArrayRow = [];
        let row = document.createElement("div");
        row.classList.add("row");
        previewSquare.appendChild(row);
        for(let j = 0; j < 4; j++)
        {
            cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = `preview-${i}-${j}`;
            previewArrayRow.push(cell);
            row.append(cell);
        }
        Game.previewArray.push(previewArrayRow);
    }
}

function generateHold(){
    // genero la cella di hold
    let holdSquare = document.getElementById("Hold");
    for (let i = 0; i < 4; i++)
    {
        let holdArrayRow = [];
        let row = document.createElement("div");
        row.classList.add("row");
        holdSquare.appendChild(row);
        for(let j = 0; j < 4; j++)
        {
            cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = `hold-${i}-${j}`;
            holdArrayRow.push(cell);
            row.append(cell);
        }
        Game.holdArray.push(holdArrayRow);
    }
}

function terminaPartita()
{
    primaPartita = false;
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
    clearInterval(Game.intervalId);
    clearInterval(Game.moveIntervalId);
}

function trovaRigheRipulite()
{
    let arrayRigheRipulite = new Array();
    let guardate = new Array();
    for (let sqr of Game.tetramino)
    {
        if(guardate.indexOf(sqr.riga) !== -1)
        { // non aggiungo righe duplicate
            continue;
        }
        guardate.push(sqr.riga);
        trovatoVuoto = false;
        for(let i = 0; i < BOARDCOLUMNS; i++)
        {
            if(!getCell(sqr.riga, i).classList.contains("Caduto"))
            {
                trovatoVuoto = true;
                break;
            }
        }
        if(trovatoVuoto)
        {
            continue;
        }
        arrayRigheRipulite.push(sqr.riga);
    }
    arrayRigheRipulite.sort();
    return arrayRigheRipulite;
}

function scorriColonna(r, c) // scorro la colonna c a partire dalla riga r
{
    for(let i = r; i > 0; i--)
    {
        getCell(i, c).className = getCell(i - 1, c).className;
    }
}

function scorriRighe(righe)
{
    for (r of righe)
    {
        for(let c = 0; c < BOARDCOLUMNS; c++)
        {
            svuotaCella(r, c);
            scorriColonna(r, c);
        }
    }
}

function refreshPunteggio()
{
    document.getElementById("Punti").innerText = Game.punti;
    document.getElementById("Lines").innerText = Game.lineeLiberate;
    prevLiv = Number(document.getElementById("Livello").innerText);

    if(prevLiv !== Game.livello)
    {
        Game.intervalDuration = Game.intervalDuration - LVL_STEP; // tolgo 30 msec all'intervallo
        clearInterval(Game.intervalId);
        Game.intervalId = setInterval(muoviTetra, Game.intervalDuration);
        document.getElementById("Livello").innerText = Game.livello;
        scriviStatus(`Nuovo livello!`, STATUS_NUOVO_LIVELLO);
        setTimeout(scriviStatus, 3000, "", "");
    }
}

function copiaTetramino(Obj)
{
    copia = [];
    for(let i of Obj)
    {
        copia.push({riga: i.riga, colonna: i.colonna});
    }
    return copia;
}

// gameIter più che muoviTetra...
function muoviTetra(incc = 0, incr = 1)
{
    aux = copiaTetramino(Game.tetramino);
    for(let sqr of aux)
    {
        sqr.riga += incr;
        sqr.colonna += incc;
    }
    if(caduto(aux))
    {
        if(incr === 1) // caso caduta
        {
            bloccaTetra(Game.tetramino);
            coloraTetra(Game.tetramino, SevenBag.tipoCorrente);
            righeRipulite = trovaRigheRipulite(); // lista di righe ripulite

            calcolaPunteggio(righeRipulite); // calcolo nuovo punteggio
            refreshPunteggio();

            if(righeRipulite.length !== 0)
            {
                scorriRighe(righeRipulite);
            }
            pulisciBoard(Game.previewArray);
            nuovoTetramino(SevenBag.tipoProssimo);
            SevenBag.tipoProssimo = tetraminoCasuale();
            scriviPreview(SevenBag.tipoProssimo);
            return true;
        }
        // altrimenti ha provato ad andare di lato ma c'era qualcosa
        return false;

    }
    // se il tetramino può spostarsi...
    let count = 0; 
    for(let sqr of Game.tetramino)
    {
        svuotaCella(sqr.riga, sqr.colonna);
    }
    for(let sqr of aux) // copio aux in tetramino e coloro le celle
    {
        Game.tetramino[count].riga = sqr.riga;
        Game.tetramino[count].colonna = sqr.colonna;
        coloraCella(sqr.riga, sqr.colonna, SevenBag.tipoCorrente);
        count++;
    }
}

// valuta se il tetramino t passato collide con qualcosa di fermo sotto.
function caduto(t)
{
    for(c of t)
    {
        // caduto in fondo
        if(!isInBound(c.riga, c.colonna)) 
        {
            return true;
        }
        // collide con un altro caduto
        if(getCell(c.riga, c.colonna).classList.contains("Caduto")) 
        {
            return true;
        }
    }
    return false;
}

function hardDrop()
{
    Game.hardDropped = true;
    while(!muoviTetra(0, 1));
}

function keyDownHandler(event)
{
    if(event.code !== "KeyA" && event.code !== "KeyD" && event.code !== "ShiftRight" 
        && event.code !== "KeyW" && event.code !== "KeyS" && event.code !== "Enter")
    {
        return; // tasto non interessante
    }
    switch(event.code)
    {
        case "KeyW":
            if(KeyState.WDown) // se il tasto era già premuto non fare nulla
            {
                return;
            }
            KeyState.WDown = true;
            ruota();
            return;
        case "KeyS":
            if(KeyState.SDown) // se il tasto era già premuto non fare nulla
            {
                return;
            }
            KeyState.SDown = true;
           clearInterval(Game.intervalId);
            Game.intervalId = setInterval(muoviTetra, MOVEMENT_SPEED);
            return;
        case "Enter":
            if(KeyState.EnterDown)
            {
                return;
            }
            hardDrop();
            return;
        case "ShiftRight":
            if(!Game.holdAllowed)
            {
                return;
            }
            Game.holdAllowed = false;
            killTetra();
            // fai funzionare come preview
            let newTetraHold = SevenBag.tipoCorrente;
            if(Game.TetraminoInHold != null)
            {
                nuovoTetramino(Game.TetraminoInHold);
            }
            else
            {
                nuovoTetramino(SevenBag.tipoProssimo);
                pulisciBoard(Game.previewArray);
                SevenBag.tipoProssimo = tetraminoCasuale();
                scriviPreview(SevenBag.tipoProssimo);
            }
            Game.TetraminoInHold = newTetraHold;
            pulisciBoard(Game.holdArray);
            scriviHold(Game.TetraminoInHold);
            return;
        default: // keyA o keyD
            if(KeyState.ADown || KeyState.DDown)
            {
                return;
            }
            KeyState.ADown = true;
            KeyState.keyDDown = true;
            let increment = ((event.code === "KeyD")? +1 : -1);
            Game.moveIntervalId = setInterval( ()=>{
                muoviTetra(increment, 0);
                }, MOVEMENT_SPEED);
    }
}

function keyUpHandler(event)
{
    if(event.code !== "KeyA" && event.code !== "KeyD" && event.code !== "KeyW" && event.code !== "KeyS" && event.code !== "Enter")
    {
        return; // tasto non interessante
    }
    switch(event.code)
    {

    case "KeyS":
        KeyState.SDown = false;
        clearInterval(Game.intervalId);
        Game.intervalId = setInterval(muoviTetra, Game.intervalDuration);
        break;
    case "KeyW":
        KeyState.WDown = false;
        break;
    case "KeyA":
    case "KeyD":
        KeyState.ADown = false;
        KeyState.DDown = false;
        clearInterval(Game.moveIntervalId);
        break;
    case "Enter":
        KeyState.EnterDown = false;
        break;
    }

}

function calcolaPunteggio(righeRipulite)
{
    Game.lineeLiberate += righeRipulite.length;
    switch(righeRipulite.length)
    {
        case 4:
        Game.punti += 800*Game.livello;
        break;
        case 3:
        Game.punti += 500*Game.livello;
        break;
        case 2: 
        Game.punti += 300*Game.livello;
        break;
        case 1: 
        Game.punti += 100*Game.livello;
        break;
    }
    if(Game.hardDropped)
    {
        Game.hardDropped = false;
        Game.punti += 10*Game.livello;
    }
    if(KeyState.SDown)
    {
        Game.punti += 5*Game.livello;
    }
    if(Game.livello < 15 && Math.floor(Game.lineeLiberate/TO_NEXT_LEVEL) > Game.livello - 1)
    {
        Game.livello++;
    }
}

function calcolaRootRotazione()
{
    let root = {};
    if(SevenBag.tipoCorrente != TETRA_I)
    {
        root = {
            riga: Game.tetramino[0].riga - 1,
            colonna: Game.tetramino[0].colonna - 1
        };
    }
    else
    {
        switch(Game.statoRotazione)
        {
            case 0:
                root = 
                {
                    riga: Game.tetramino[0].riga,
                    colonna: Game.tetramino[0].colonna
                }
            break;
            case 1:
                root = 
                {
                    riga: Game.tetramino[0].riga + 1,
                    colonna: Game.tetramino[0].colonna - 2
                }
            break;
            case 2:
                root =
                {
                    riga: Game.tetramino[0].riga - 1,
                    colonna: Game.tetramino[0].colonna 
                }
            break;
            case 3:
                root =
                {
                    riga: Game.tetramino[0].riga + 1,
                    colonna: Game.tetramino[0].colonna -1
                }
            break;
        }
    }
    return root;
}

// ritorna la posizione di dove ruoterebbe il tetramino se non ci fossero conflitti
function provaRotazione(root)
{
    let tryTetra = new Array();
    for (let i = 0; i < 4; i++)
    {
        tryTetra.push(
        {
            riga: POSIZIONI_TETRAMINI[SevenBag.tipoCorrente][(Game.statoRotazione + 1) % 4][i][0] + root.riga,
            colonna: POSIZIONI_TETRAMINI[SevenBag.tipoCorrente][(Game.statoRotazione + 1) % 4][i][1] + root.colonna
        });
    }
    return tryTetra;
}

function ruota()
{
    if( SevenBag.tipoCorrente === TETRA_O)
    { // inutile provare
        return;
    }
    //wallkick
    let tryTetra;
    let canRotate = false;
    for(let i of [0, -1, 1]) // prima provo nel suo posto, poi sinistra e dx
    {
        let root = calcolaRootRotazione();
        root.colonna += i;
        tryTetra = provaRotazione(root); 
        if(isInBound(root.riga, root.colonna) && !caduto(tryTetra))
        { 
            canRotate = true;
            break; 
        }
    }
    if(!canRotate) 
    {
        return;
    }
    // se il tetramino può spostarsi...
    // riesco a colorarlo quindi cancello quello vecchio
    for(let c of Game.tetramino)
    {
        svuotaCella(c.riga, c.colonna);
    }
    Game.statoRotazione = (Game.statoRotazione + 1) % 4;
    // coloro quello nuovo e aggiorno tetramino
    let count = 0; 
    for(let sqr of tryTetra) // copio aux in tetramino e coloro le celle
    {
        Game.tetramino[count].riga = sqr.riga;
        Game.tetramino[count].colonna = sqr.colonna;
        coloraCella(sqr.riga, sqr.colonna, SevenBag.tipoCorrente);
        count++;
    }
}

function clearBoard()
{
    for (c of document.getElementsByClassName("cell"))
    {
        c.className = "cell";
    }
}

function startGame()
{
    document.getElementById("Start").classList.add("Nascosto");
    document.getElementById("Restart").classList.remove("Nascosto");
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);


// per quando ricomincia la partita
    clearBoard();
    Game.hardDropped = 0;
    Game.livello = 1; 
    document.getElementById("Livello").innerText = Game.livello;
    Game.punti = 0;
    Game.lineeLiberate = 0;
    document.getElementById("Lines").innerText = 0;
    document.getElementById("Punti").innerText = Game.punti;
    Game.intervalDuration = INIT_INTERVAL_DURATION;
    document.getElementById("Status").innerText = "";
    Game.holdAllowed = true;

    nuovoTetramino(tetraminoCasuale());
    SevenBag.tipoProssimo = tetraminoCasuale();
    scriviPreview(SevenBag.tipoProssimo);
    Game.intervalId = setInterval(muoviTetra, Game.intervalDuration);
}
