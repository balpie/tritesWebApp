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

function nuovoTetramino(tipo)
{
    switch(tipo)
    {
        case TETRA_I:
            for(let i = 0; i < 4; i++)
            {
                tetramino[i].riga = 0;
                tetramino[i].colonna = i;
                document.getElementById(`cell-${0}-${i+3}`).classList.add(TETRA_I);
            }
        break;
        case TETRA_L:

            for(let i = 0; i < 3; i++)
            {
                tetramino[i].riga = 0;
                tetramino[i].colonna = i;
                document.getElementById(`cell-${0}-${i+3}`).classList.add(TETRA_L);
            }
            document.getElementById(`cell-${1}-${5}`).classList.add(TETRA_L);
            tetramino[3].riga = 1;
            tetramino[3].colonna = 5;
        break;
        case TETRA_J:
            document.getElementById(`cell-${1}-${3}`).classList.add(TETRA_J);
            tetramino[3].riga = 1;
            tetramino[3].colonna = 3;
            for(let i = 0; i < 3; i++)
            {
                tetramino[i].riga = 0;
                tetramino[i].colonna = i;
                document.getElementById(`cell-${0}-${i+3}`).classList.add(TETRA_J);
            }
        break;
        case TETRA_O:
            for(let i = 0; i < 2; i++)
            {
                for(let j = 0; j < 2; j++)
                {
                    document.getElementById(`cell-${i}-${j+4}`).classList.add(TETRA_O);
                    tetramino[i*2+j].riga = i;
                    tetramino[i*2+j].colonna = j;
                }
            }
        break;
        case TETRA_S:
            for(let i = 0; i < 2; i++)
            {
                for(let j = 0; j < 2; j++)
                {
                    if(i == 0)
                    {
                        document.getElementById(`cell-${i}-${j+4}`).classList.add(TETRA_S);
                    }
                    else
                    {
                        document.getElementById(`cell-${i}-${j+3}`).classList.add(TETRA_S);
                    }
                    tetramino[i*2+j].riga = i;
                    tetramino[i*2+j].colonna = j;
                }
            }
        break;
        case TETRA_Z:
            for(let i = 0; i < 2; i++)
            {
                for(let j = 0; j < 2; j++)
                {
                    if(i == 0)
                    {
                        document.getElementById(`cell-${i}-${j+4}`).classList.add(TETRA_Z);
                    }
                    else
                    {
                        document.getElementById(`cell-${i}-${j+5}`).classList.add(TETRA_Z);
                    }
                    tetramino[i*2+j].riga = i;
                    tetramino[i*2+j].colonna = j;
                }
            }
        break;
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