document.addEventListener("DOMContentLoaded", generateBoard);

const BOARDCOLUMNS = 10;
const BOARDROWS = 25;

let tetramino = [ // tetramino in caduta libera
    {riga: undefined, colonna: undefined},
    {riga: undefined, colonna: undefined},
    {riga: undefined, colonna: undefined},
    {riga: undefined, colonna: undefined}
];
let tipoCorrente;

let intervalId;

const TETRA_T = "T"; // tipi di tetramini
const TETRA_L = "L";
const TETRA_J = "J";
const TETRA_I = "I";
const TETRA_O = "O";
const TETRA_S = "S";
const TETRA_Z = "Z";

// posizione dei tetramini (relative)
const POSIZIONI_TETRAMINI = {
    "I": [[0, 0], [0, 1], [0, 2], [0, 3]],
    "L": [[0, 0], [0, 1], [0, 2], [1, 2]],
    "J": [[0, 0], [0, 1], [0, 2], [1, 0]],
    "T": [[0, 0], [0, 1], [0, 2], [1, 1]],
    "O": [[0, 0], [0, 1], [1, 0], [1, 1]],
    "S": [[0, 1], [0, 2], [1, 0], [1, 1]],
    "Z": [[0, 0], [0, 1], [1, 1], [1, 2]]
}

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
        case 2: return TETRA_J
        case 3: return TETRA_T
        case 4: return TETRA_O;
        case 5: return TETRA_S
        case 6: return TETRA_Z
    }
    return ;
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
    const coordinate = POSIZIONI_TETRAMINI[tipo];
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

function muoviTetra(incc = 0, incr = 1)
{
    aux = structuredClone(tetramino);
    for(let sqr of aux)
    {
        svuotaCella(sqr.riga, sqr.colonna);
        sqr.riga++;
    }
    if(caduto(aux))
    {
        bloccaTetra(tetramino);
        coloraTetra(tetramino, tipoCorrente);
        nuovoTetramino(tetraminoCasuale());
        return;
    }
    let count = 0; 
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
}

function move(event)
{
    if(event.code !== "arrowRight" && event.code !== "arrowLeft" )
    {
        return; // nothing to do
    }
    let increment = (event.code === "arrowRight")? +1 : -1;

}

function startGame()
{
    document.getElementById("Start").disabled = true;
    document.addEventListener("keydown", move);
    nuovoTetramino(tetraminoCasuale());
    intervalId = setInterval(muoviTetra, 200);
}