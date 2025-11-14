document.addEventListener("DOMContentLoaded", generateBoard);
document.addEventListener("DOMContentLoaded", generatePreview);
document.addEventListener("DOMContentLoaded", generateHold);

function nuovoTetramino(tipo) // Logica di gioco perchè "lo mette" in movimento
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
        toggleInMovimento(Game.tetramino[i].riga, Game.tetramino[i].colonna);
    }
    for (let sqr of Game.tetramino)
    {
        coloraCella(sqr.riga, sqr.colonna, tipo);
    }
}


function generateBoard() // Modulo init?
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

function generateHold(){ // modulo init?
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

function terminaPartita(postaPartita) // Logica di gioco
{
    clearInterval(Game.intervalId);
    clearInterval(Game.moveIntervalId);
    primaPartita = false;
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
    if(postaPartita && !PostInfo.postSent)
    {
        PostInfo.postSent = true;
        console.log("Invio POST");
        let http = new XMLHttpRequest();
        let url = "insertPartita.php";
        if (Game.hardDropped)
        { // calcolo subito altrimenti non vengono conteggiati
            Game.punti += 10 * Game.livello;
            Game.hardDropped = false;
        }
        let parameters = "Punti=" + Game.punti + "&LineeRipulite=" + Game.lineeLiberate;
            // apro un post verso insertPartita.php in modo asincrono:
        http.open("POST", url, true); 
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send(parameters);
    }
}

function trovaRigheRipulite() // Utility
{
    let arrayRigheRipulite = new Array();
    let guardate = new Array();
    for (let sqr of Game.tetramino)
    {
        if(guardate.indexOf(sqr.riga) !== -1)
        { // non aggiungo righe duplicate
            continue;
        }
        console.log("guardo riga: "+sqr.riga); 
        guardate.push(sqr.riga);
        let trovatoVuoto = false;
        for(let i = 0; i < BOARDCOLUMNS; i++)
        {
            if(!getCell(sqr.riga, i).classList.contains("Caduto"))
            {
                console.log("Trovato vuoto in riga"+ sqr.riga);
                trovatoVuoto = true;
                break;
            }
        }
        if(trovatoVuoto)
        {
            continue;
        }
        console.log("trovato riga ripulita: ", sqr.riga);
        arrayRigheRipulite.push(sqr.riga);
    }
    arrayRigheRipulite.sort();
    return arrayRigheRipulite;
}

function refreshPunteggio() // Logica di gioco (cambia livello effettivo)
{
    document.getElementById("Punti").innerText = Game.punti;
    document.getElementById("Lines").innerText = Game.lineeLiberate;
    prevLiv = Number(document.getElementById("Livello").innerText);

    if(prevLiv !== Game.livello)
    {
        Game.intervalDuration = Game.intervalDuration - LVL_STEP; // tolgo 30 msec all'intervallo
        clearInterval(Game.intervalId);
        Game.intervalId = setInterval(gameIter, Game.intervalDuration);
        document.getElementById("Livello").innerText = Game.livello;
        scriviStatus(`Nuovo livello!`, STATUS_NUOVO_LIVELLO);
        setTimeout(scriviStatus, 3000, "", "");
    }
}

// iterazione del gioco con tetramino che si sposta in direzione (incc, incr)
function gameIter(incc = 0, incr = 1) // Logica di gioco
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
            console.log("Chiamo bloccatetra");
            bloccaTetra(Game.tetramino);
            coloraTetra(Game.tetramino, SevenBag.tipoCorrente);

            let righeRipulite = trovaRigheRipulite(); // lista di righe ripulite
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
    killTetra();
    
    cambiaTetra(aux);
}

// valuta se il tetramino t passato collide con qualcosa di fermo sotto.
function caduto(t) // Utility
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

function hardDrop() //Logica di gioco
{
    Game.hardDropped = true;
    while(!gameIter(0, 1));
}

function keyDownHandler(event) // Key handle (forse da spezzettare)
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
            Game.intervalId = setInterval(gameIter, MOVEMENT_SPEED);
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
            if(Game.tetraminoInHold != null)
            {
                nuovoTetramino(Game.tetraminoInHold);
            }
            else
            {
                nuovoTetramino(SevenBag.tipoProssimo);
                pulisciBoard(Game.previewArray);
                SevenBag.tipoProssimo = tetraminoCasuale();
                scriviPreview(SevenBag.tipoProssimo);
            }
            Game.tetraminoInHold = newTetraHold;
            pulisciBoard(Game.holdArray);
            scriviHold(Game.tetraminoInHold);
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
                gameIter(increment, 0);
                }, MOVEMENT_SPEED);
    }
}

function keyUpHandler(event) //Key handler
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
        Game.intervalId = setInterval(gameIter, Game.intervalDuration);
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

function calcolaPunteggio(righeRipulite)  //Utility / gamelogic
{ //TODO aggiungi costanti
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

function calcolaRootRotazione() // Utility
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
function provaRotazione(root) // Utility
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

function ruota() // Logica di gioco
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
    killTetra();
    Game.statoRotazione = (Game.statoRotazione + 1) % 4;

    cambiaTetra(tryTetra);
}

function startGame() // Init (?)
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
