document.addEventListener("DOMContentLoaded", generateBoard);

const BOARDCOLUMNS = 10;
const BOARDROWS = 20;

let tetramino = [ // tetramino in caduta libera
    {riga: undefined, colonna: undefined},
    {riga: undefined, colonna: undefined},
    {riga: undefined, colonna: undefined},
    {riga: undefined, colonna: undefined}
];
let tipoCorrente;

let intervalId;
let moveIntervalId;
let intervalDuration = 250;

const movementSpeed = 60;

let punti = 0;
let livello = 1;
/*
 **** CALCOLO PUNTEGGIO: 
 * singola linea: 100pts * liv
 * doppia linea: 300pts * liv
 * tripla linea: 500pts * liv
 * drop veloce: 25pts*liv
 */

// indica se i tasti sono premuti
let keySDown = false;
let keyWDown = false;
let keyADown = false;
let keyDDown = false;

let lineCleared = 0; // Prima versione di punteggio

const TETRA_T = "T"; // tipi di tetramini
const TETRA_L = "L";
const TETRA_J = "J";
const TETRA_I = "I";
const TETRA_O = "O";
const TETRA_S = "S";
const TETRA_Z = "Z";

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
    return document.getElementById(`cell-${row}-${col}`);
}

function tetraminoCasuale()
{
    let x = Math.floor(Math.random() * 7);
    switch(x){
        case 0: return TETRA_I;
        case 1: return TETRA_L;
        case 2: return TETRA_J;
        case 3: return TETRA_T;
        case 4: return TETRA_O;
        case 5: return TETRA_S;
        case 6: return TETRA_Z;
    }
    return undefined;
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
        getCell(c.riga, c.colonna).classList.remove("inMovimento");
        getCell(c.riga, c.colonna).classList.add("Caduto"); // serve alla collision detection
    }
}

function nuovoTetramino(tipo)
{
    tipoCorrente = tipo;
    statoRotazione = 0;
    const coordinate = POSIZIONI_TETRAMINI[tipo][statoRotazione];
    for(let i = 0; i < 4; i++)
    {
        tetramino[i].riga = coordinate[i][0] + 1;
        if(tipo === TETRA_O)
        {
        tetramino[i].colonna = coordinate[i][1] + 4;
        }
        else
        {
            tetramino[i].colonna = coordinate[i][1] + 3;
        }
        coloraCella(tetramino[i].riga, tetramino[i].colonna, tipo);
        toggleInMovimento(tetramino[i].riga, tetramino[i].colonna);
    }
}

function generateBoard()
{
    document.getElementById("Start").addEventListener("click", startGame);
    document.getElementById("Stop").addEventListener("click", stopGame);

    board = document.getElementById("gameBoard");
    for(let i = 0; i < BOARDROWS; i++)
    {
        row = document.createElement("div");
        row.classList.add("row");
        board.appendChild(row);
        for(let j = 0; j < BOARDCOLUMNS; j++)
        {
            cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = `cell-${i}-${j}`;
            row.appendChild(cell);
        }
    }
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
        console.log("copio proprietà di cella" + i +", "+ c + "in" + i - 1 +", "+ c);
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
    pts = document.getElementById("Punti");
    pts.innerText = punti;
}

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

            // TODO ripulisci sta funzione che fa troppe cose

            calcolaPunteggio(righeRipulite); // calcolo nuovo punteggio
            refreshPunteggio();

            if(righeRipulite.length !== 0)
            {
                scorriRighe(righeRipulite);
            }
            nuovoTetramino(tetraminoCasuale());
        }
        // altrimenti ha provato ad andare di lato ma c'era qualcosa
        return;

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
            return true;
        }
        // caduto sopra un altro caduto
        if(getCell(c.riga, c.colonna).classList.contains("Caduto")) 
        {
            return true;
        }
    }
    return false;
}

//TODO: rotazione
function keyDownHandler(event)
{
    if(event.code !== "KeyA" && event.code !== "KeyD" && event.code !== "KeyW" && event.code !== "KeyS")
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
        intervalId = setInterval(muoviTetra ,Math.floor(intervalDuration/3));
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
        }, movementSpeed);
    console.log("Creo intervallo movimento orizzontale: " + moveIntervalId);
}

function keyUpHandler(event)
{
    if(event.code !== "KeyA" && event.code !== "KeyD" && event.code !== "KeyW" && event.code !== "KeyS")
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
        console.log("fermo intervallo movimento orizzontale");
        keyADown = false;
        keyDDown = false;
        clearInterval(moveIntervalId);
    }

}

function calcolaPunteggio(righeRipulite)
{
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
    if(keySDown)
    {
        punti += 25*livello;
    }
}

// ritorna la posizione di dove ruoterebbe il tetramino se non ci fossero conflitti
function provaRotazione()
{
    let tryTetra = new Array();
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
    let tryTetra = provaRotazione(); 
    if(caduto(tryTetra))
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

function startGame()
{
    document.getElementById("Start").disabled = true;
    document.getElementById("Stop").disabled = false;
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    nuovoTetramino(tetraminoCasuale());
    intervalId = setInterval(muoviTetra, intervalDuration);
}

function stopGame()
{
    clearInterval(intervalId);
    document.getElementById("Start").disabled = false;
    document.getElementById("Stop").disabled = true;
}