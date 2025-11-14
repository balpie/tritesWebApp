document.addEventListener("DOMContentLoaded", generateBoard);
document.addEventListener("DOMContentLoaded", generatePreview);
document.addEventListener("DOMContentLoaded", generateHold);

function generateBoard() 
{
    document.getElementById("Start").addEventListener("click", startGame);
    document.getElementById("Restart").classList.add("Nascosto");
    document.getElementById("Restart").addEventListener("click", ()=> {
            document.getElementById("Restart").classList.add("Nascosto");
            document.getElementById("Restart").blur();
            terminaPartita(false);
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

function startGame() 
{
    document.getElementById("Start").classList.add("Nascosto");
    document.getElementById("Restart").classList.remove("Nascosto");
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);


// per quando ricomincia la partita
    pulisciBoard(Game.cellArray);
    pulisciBoard(Game.holdArray);
    pulisciBoard(Game.previewArray);
    PostInfo.postSent = false;
    Game.hardDropped = 0;
    Game.livello = 1; 
    document.getElementById("Livello").innerText = Game.livello;
    Game.punti = 0;
    Game.lineeLiberate = 0;
    document.getElementById("Lines").innerText = 0;
    document.getElementById("Punti").innerText = 0;
    Game.intervalDuration = INIT_INTERVAL_DURATION;
    document.getElementById("Status").innerText = "";
    Game.holdAllowed = true;

    nuovoTetramino(tetraminoCasuale());
    SevenBag.tipoProssimo = tetraminoCasuale();
    scriviPreview(SevenBag.tipoProssimo);
    Game.intervalId = setInterval(gameIter, Game.intervalDuration);
}