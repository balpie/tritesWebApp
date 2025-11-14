
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
    if(collide(aux))
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


function bloccaTetra(t)
{
    let termina = false;
    for (c of t)
    {

        if(c.riga == BOARDHIDDENROWS)
        { // caso sconfitta
            termina = true;
        }
        getCell(c.riga, c.colonna).classList.remove("inMovimento");
        getCell(c.riga, c.colonna).classList.add("Caduto"); // serve alla collision detection
    }
    if(termina)
    {
        scriviStatus("Hai perso :(", STATUS_SCONFITTA);
        terminaPartita(true);
    }
    Game.holdAllowed = true;
    // todo timeout intervalDuration+10ms per dare tempo di muoversi e poi riparte 
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
            if(!Game.holdAllowed) // TODO Funzione hold
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
        default: // TODO: Separa
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

function calcolaPunteggio(righeRipulite)  
{ 
    Game.lineeLiberate += righeRipulite.length;
    switch(righeRipulite.length)
    {
        case 4:
        Game.punti += PTS_TETRIS*Game.livello;
        break;
        case 3:
        Game.punti += PTS_TRIPLE*Game.livello;
        break;
        case 2: 
        Game.punti += PTS_DOUBLE*Game.livello;
        break;
        case 1: 
        Game.punti += PTS_SINGLE*Game.livello;
        break;
    }
    if(Game.hardDropped)
    {
        Game.hardDropped = false;
        Game.punti += PTS_HARD_DROP_MULT*Game.livello;
    }
    if(KeyState.SDown)
    {
        Game.punti += PTS_SOFT_DROP_MULT*Game.livello;
    }
    if(Game.livello < MAX_LEVEL && Math.floor(Game.lineeLiberate/TO_NEXT_LEVEL) > Game.livello - 1)
    {
        Game.livello++;
    }
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
        if(isInBound(root.riga, root.colonna) && !collide(tryTetra))
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
