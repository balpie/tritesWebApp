
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
        toggleInMovimento(Game.tetramino[i].riga, Game.tetramino[i].colonna);
    }
    for (let sqr of Game.tetramino)
    {
        coloraCella(sqr.riga, sqr.colonna, tipo);
    }
}


function terminaPartita(postaPartita) 
{
    clearInterval(Game.intervalId);
    clearInterval(Game.moveIntervalId);
    primaPartita = false;
    document.removeEventListener("keydown", keyDownHandler);
    document.removeEventListener("keyup", keyUpHandler);
    if(postaPartita && !PostInfo.postSent)
    {
        PostInfo.postSent = true;
        let http = new XMLHttpRequest();
        let url = "insertPartita.php";
        if (Game.hardDropped)
        { 
            // calcolo qui altrimenti non vengono conteggiati in caso di fine partita
            Game.punti += 10 * Game.livello;
            Game.hardDropped = false;
        }
        let parameters = "Punti=" + Game.punti + "&LineeRipulite=" + Game.lineeLiberate;
        http.open("POST", url, true); 
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send(parameters);
    }
}


function refreshPunteggio() 
{
    document.getElementById("Punti").innerText = Game.punti;
    document.getElementById("Lines").innerText = Game.lineeLiberate;
    prevLiv = Number(document.getElementById("Livello").innerText);

    if(prevLiv !== Game.livello)
    {
        Game.intervalDuration = Game.intervalDuration - LVL_STEP; 
        clearInterval(Game.intervalId);
        Game.intervalId = setInterval(gameIter, Game.intervalDuration);
        document.getElementById("Livello").innerText = Game.livello;
        scriviStatus(`Nuovo livello!`, STATUS_NUOVO_LIVELLO);
        setTimeout(scriviStatus, 3000, "", "");
    }
}

// iterazione del gioco con tetramino che si sposta in direzione (incc, incr)
// Ritorna true se il tetramino è caduto
function gameIter(incc = 0, incr = 1) 
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
            bloccaTetra(Game.tetramino);
            coloraTetra(Game.tetramino, SevenBag.tipoCorrente);

            let righeRipulite = trovaRigheRipulite(); 
            calcolaPunteggio(righeRipulite); 
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
    killTetra();
    cambiaTetra(aux);
}


function bloccaTetra(t)
{
    let termina = false;
    for (c of t)
    {

        if(c.riga == BOARDHIDDENROWS)
        { // se il tetramino arriva qui è il caso sconfitta
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
}


function hardDrop() 
{
    Game.hardDropped = true;
    while(!gameIter(0, 1));
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


function ruota() 
{
    if( SevenBag.tipoCorrente === TETRA_O)
    { 
        return;
    }
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
