document.addEventListener("DOMContentLoaded", generateBoard);

const BOARDCOLUMNS = 10;
const BOARDROWS = 25;

let tetramino = [ // tetramino in caduta libera
    {riga: undefined, colonna: undefined},
    {riga: undefined, colonna: undefined},
    {riga: undefined, colonna: undefined},
    {riga: undefined, colonna: undefined}
];


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

function coloraCella(row, col, color)
{
    document.getElementById(`cell-${row}-${col}`).classList.add(color);
}

function svuotaCella(row, col)
{
    document.getElementById(`cell-${row}-${col}`).className = "cell";
}

function killTetra()
{
    for (let i of tetramino)
    {
        svuotaCella(i.riga, i.colonna);
    }
}

function nuovoTetramino(tipo)
{
    const coordinate = POSIZIONI_TETRAMINI[tipo];
    for(let i = 0; i < 4; i++)
    {
        tetramino[i].riga = coordinate[i][0];
        tetramino[i].colonna = coordinate[i][1] + 3;
        coloraCella(tetramino[i].riga, tetramino[i].colonna, tipo);
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

function startGame()
{
    document.getElementById("Start").disabled = true;
    nuovoTetramino(TETRA_J);
}