document.addEventListener("DOMContentLoaded", generateBoard);
document.addEventListener("DOMContentLoaded", generatePreview);

const BOARDCOLUMNS = 10;
const BOARDROWS = 22;
const BOARDHIDDENROWS = 2;
const INIT_INTERVAL_DURATION = 400;

let cellArray = [];
let previewArray = [];

let tipoProssimo; // tipo visto in preview

let tetramino = [ // tetramino in caduta libera
    {riga: undefined, colonna: undefined},
    {riga: undefined, colonna: undefined},
    {riga: undefined, colonna: undefined},
    {riga: undefined, colonna: undefined}
];


let tipoCorrente;
let hardDropped = false;

let intervalId;
let moveIntervalId;
let intervalDuration = INIT_INTERVAL_DURATION;

const TO_NEXT_LEVEL = 5; // linee da ripulire prima di arrivare al livello successivo

const MOVEMENT_SPEED = 60;

let lineeLiberate = 0;
let punti = 0;
let livello = 1;
/*
 **** CALCOLO PUNTEGGIO: 
 * singola linea: 100pts * liv
 * doppia linea: 300pts * liv
 * tripla linea: 500pts * liv
 * drop veloce: 25pts * liv
 * hard drop: 50pts * liv
 */

// indica se i tasti sono premuti
let keySDown = false;
let keyWDown = false;
let keyADown = false;
let keyDDown = false;
let EnterDown = false; 


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
let codaTetramini = []; // 14 tetramini
let currTetra_ind;

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


let statoRotazione;

function isInBound(r, c)
{
    return (r < BOARDROWS && r >= 0 && c < BOARDCOLUMNS && c >= 0);
}

function getCell(row, col)
{
    return cellArray[row][col];
}

function tetraminoCasuale()
{
    let nuovoIndice = (currTetra_ind + 1) % 14;
    if(nuovoIndice === 0)
    {
        shuffle(codaTetramini, 7, 13);
    }
    if(nuovoIndice === 7)
    {
        shuffle(codaTetramini, 0, 6);
    }
    currTetra_ind = nuovoIndice;
    return codaTetramini[nuovoIndice];
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
    for (let i of tetramino)
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
            document.getElementById("Status").innerText = "Hai perso :(";
            terminaPartita();
        }
        getCell(c.riga, c.colonna).classList.remove("inMovimento");
        getCell(c.riga, c.colonna).classList.add("Caduto"); // serve alla collision detection
    }
}

function scriviPreview(tipo)
{
    const coordinate = POSIZIONI_TETRAMINI[tipo][0];
    const coordinateVecchio = POSIZIONI_TETRAMINI[tipoCorrente][0];
    for(let i = 0; i < 4; i++)
    {
        let r, c;
        switch(tipoCorrente)
        {
            case TETRA_I: 
                r = coordinateVecchio[i][0] + 1;
                c = coordinateVecchio[i][1];
            break;
            default:
                r = coordinateVecchio[i][0] + 1;
                c = coordinateVecchio[i][1] + 1;
        }
        previewArray[r][c].className = "cell";
    }
    for(let i = 0; i < 4; i++)
    {
        let r, c;
        switch(tipoProssimo)
        {
            case TETRA_I: 
                r = coordinate[i][0] + 1;
                c = coordinate[i][1];
            break;
            default:
                r = coordinate[i][0] + 1;
                c = coordinate[i][1] + 1;
        }
        previewArray[r][c].classList.add(tipo);
    }
}

function nuovoTetramino(tipo)
{
    tipoCorrente = tipo;
    statoRotazione = 0;
    const coordinate = POSIZIONI_TETRAMINI[tipo][statoRotazione];
    for(let i = 0; i < 4; i++)
    {
        tetramino[i].riga = coordinate[i][0];
        if(tipo === TETRA_O)
        {
        tetramino[i].colonna = coordinate[i][1] + 4;
        }
        else
        {
            tetramino[i].colonna = coordinate[i][1] + 3;
        }
        if(getCell(tetramino[i].riga, tetramino[i].colonna).classList.contains("caduto"))
        {
            terminaPartita();
            return;
        }
        toggleInMovimento(tetramino[i].riga, tetramino[i].colonna);
    }
    for (let sqr of tetramino)
    {
        coloraCella(sqr.riga, sqr.colonna, tipo);
    }
}

// mescola gli elementi di a, da ini a fin
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
    codaTetramini = structuredClone(arrayTipiTetramini);
    for(let i = 0; i < 7; i++)
    {
        codaTetramini.push(arrayTipiTetramini[i]);
    }
    shuffle(codaTetramini, 0, 6);
    shuffle(codaTetramini, 7, 13);
    currTetra_ind = 0;

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
        cellArray.push(cellArrRow);
    }
}
function generatePreview(){
    // genero la cella di preview
    previewSquare = document.getElementById("Preview");
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
        previewArray.push(previewArrayRow);
    }
}

function terminaPartita()
{
    primaPartita = false;
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
    clearInterval(intervalId);
    clearInterval(moveIntervalId);
}

function trovaRigheRipulite()
{
    let arrayRigheRipulite = new Array();
    let guardate = new Array();
    for (let sqr of tetramino)
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
    document.getElementById("Punti").innerText = punti;
    document.getElementById("Lines").innerText = lineeLiberate;
    prevLiv = Number(document.getElementById("Livello").innerText);

    if(prevLiv !== livello)
    {
        intervalDuration = intervalDuration - 30; // tolgo 30 msec all'intervallo
        clearInterval(intervalId);
        intervalId = setInterval(muoviTetra, intervalDuration);
        document.getElementById("Livello").innerText = livello;
    }
}

// gameIter più che muoviTetra...
function muoviTetra(incc = 0, incr = 1)
{
    aux = structuredClone(tetramino);
    for(let sqr of aux)
    {
        sqr.riga += incr;
        sqr.colonna += incc;
    }
    if(caduto(aux))
    {
        if(incr === 1) // caso caduta
        {
            bloccaTetra(tetramino);
            coloraTetra(tetramino, tipoCorrente);
            righeRipulite = trovaRigheRipulite(); // lista di righe ripulite

            calcolaPunteggio(righeRipulite); // calcolo nuovo punteggio
            refreshPunteggio();

            if(righeRipulite.length !== 0)
            {
                scorriRighe(righeRipulite);
            }
            nuovoTetramino(tipoProssimo);
            tipoProssimo = tetraminoCasuale();
            scriviPreview(tipoProssimo);
            return true;
        }
        // altrimenti ha provato ad andare di lato ma c'era qualcosa
        return false;

    }
    // se il tetramino può spostarsi...
    let count = 0; 
    for(let sqr of tetramino)
    {
        svuotaCella(sqr.riga, sqr.colonna);
    }
    for(let sqr of aux) // copio aux in tetramino e coloro le celle
    {
        tetramino[count].riga = sqr.riga;
        tetramino[count].colonna = sqr.colonna;
        coloraCella(sqr.riga, sqr.colonna, tipoCorrente);
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
            console.log("caduto: out of bound");
            return true;
        }
        // collide con un altro caduto
        if(getCell(c.riga, c.colonna).classList.contains("Caduto")) 
        {
            console.log("caduto: collisione");
            return true;
        }
    }
    return false;
}

function hardDrop()
{
    hardDropped = true;
    while(!muoviTetra(0, 1));
}

function keyDownHandler(event)
{
    if(event.code !== "KeyA" && event.code !== "KeyD" && event.code !== "KeyW" && event.code !== "KeyS" && event.code !== "Enter")

    {
        return; // tasto non interessante
    }
    if(event.code === "KeyW")
    {
        if(keyWDown) // se il tasto era già premuto non fare nulla
        {
            return;
        }
        keyWDown = true;
        ruota();
        return;
    }
    if(event.code === "KeyS")
    {
        if(keySDown) // se il tasto era già premuto non fare nulla
        {
            return;
        }
        keySDown = true;
        clearInterval(intervalId);
        intervalId = setInterval(muoviTetra, MOVEMENT_SPEED);
        return;
    }
    if(event.code === "Enter")
    {
        if(EnterDown)
        {
            return;
        }
        hardDrop();
        return;
    }
    if(keyADown || keyDDown)
    {
        return;
    }
    keyADown = true;
    keyDDown = true;
    let increment = ((event.code === "KeyD")? +1 : -1);
    moveIntervalId = setInterval( ()=>{
        muoviTetra(increment, 0);
        }, MOVEMENT_SPEED);
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
        keySDown = false;
        clearInterval(intervalId);
        intervalId = setInterval(muoviTetra, intervalDuration);
        break;
    case "KeyW":
        keyWDown = false;
        break;
    case "KeyA":
    case "KeyD":
        keyADown = false;
        keyDDown = false;
        clearInterval(moveIntervalId);
        break;
    case "Enter":
        EnterDown = false;
        break;
    }

}

function calcolaPunteggio(righeRipulite)
{
    lineeLiberate += righeRipulite.length;
    switch(righeRipulite.length)
    {
        case 4:
        punti += 800*livello;
        break;
        case 3:
        punti += 500*livello;
        break;
        case 2: 
        punti += 300*livello;
        break;
        case 1: 
        punti += 100*livello;
        break;
    }
    if(hardDropped)
    {
        hardDropped = false;
        punti += 50*livello;
    }
    if(keySDown)
    {
        punti += 25*livello;
    }
    if(Math.floor(lineeLiberate/TO_NEXT_LEVEL) > livello - 1)
    {
        livello++;
    }
}

function calcolaRootRotazione()
{
    let root = {};
    if(tipoCorrente != TETRA_I)
    {
        root = {
            riga: tetramino[0].riga - 1,
            colonna: tetramino[0].colonna - 1
        };
    }
    else
    {
        switch(statoRotazione)
        {
            case 0:
                root = 
                {
                    riga: tetramino[0].riga,
                    colonna: tetramino[0].colonna
                }
            break;
            case 1:
                root = 
                {
                    riga: tetramino[0].riga + 1,
                    colonna: tetramino[0].colonna - 2
                }
            break;
            case 2:
                root =
                {
                    riga: tetramino[0].riga - 1,
                    colonna: tetramino[0].colonna 
                }
            break;
            case 3:
                root =
                {
                    riga: tetramino[0].riga + 1,
                    colonna: tetramino[0].colonna -1
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
            riga: POSIZIONI_TETRAMINI[tipoCorrente][(statoRotazione + 1) % 4][i][0] + root.riga,
            colonna: POSIZIONI_TETRAMINI[tipoCorrente][(statoRotazione + 1) % 4][i][1] + root.colonna
        });
    }
    return tryTetra;
}

function ruota()
{
    if( tipoCorrente === TETRA_O)
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
        console.log(`Root tentativo rotazione [${i}]-${root.riga}-${root.colonna}`);
        console.log("isInBound" + isInBound(root.riga, root.colonna));
        console.log("caduto(tryTetra): " + caduto(tryTetra));
        if(isInBound(root.riga, root.colonna) && !caduto(tryTetra))
        { 
            console.log("Può ruotare con offset: " + i);
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
    for(let c of tetramino)
    {
        svuotaCella(c.riga, c.colonna);
    }
    statoRotazione = (statoRotazione + 1) % 4;
    // coloro quello nuovo e aggiorno tetramino
    let count = 0; 
    for(let sqr of tryTetra) // copio aux in tetramino e coloro le celle
    {
        tetramino[count].riga = sqr.riga;
        tetramino[count].colonna = sqr.colonna;
        coloraCella(sqr.riga, sqr.colonna, tipoCorrente);
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
    hardDropped = 0;
    livello = 1; 
    document.getElementById("Livello").innerText = livello;
    punti = 0;
    lineeLiberate = 0;
    document.getElementById("Lines").innerText = 0;
    document.getElementById("Punti").innerText = punti;
    intervalDuration = INIT_INTERVAL_DURATION;
    document.getElementById("Status").innerText = "";

    nuovoTetramino(tetraminoCasuale());
    tipoProssimo = tetraminoCasuale();
    scriviPreview(tipoProssimo);
    intervalId = setInterval(muoviTetra, intervalDuration);
}
