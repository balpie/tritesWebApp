function isInBound(r, c)
{
    return (r < BOARDROWS && r >= 0 && c < BOARDCOLUMNS && c >= 0);
}

function getCell(row, col)
{
    return Game.cellArray[row][col];
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

function copiaTetramino(Obj)
{
    copia = [];
    for(let i of Obj)
    {
        copia.push({riga: i.riga, colonna: i.colonna});
    }
    return copia;
}
