function isInBound(r, c)
{
    return (r < BOARDROWS && r >= 0 && c < BOARDCOLUMNS && c >= 0);
}

function getCell(row, col)
{
    return Game.cellArray[row][col];
}

// mescola gli elementi di a, da ini a fin
function shuffle(a, ini, fin)
{
    for(let i = fin - 1; i >= ini; i--)
    {
        let aux = ini + Math.floor(Math.random() * (i - ini + 1));
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
    }
    if(nuovoIndice === 7)
    {
        shuffle(SevenBag.codaTetramini, 0, 6);
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
function cambiaTetra(newTetra)
{
    let count = 0;
    for(let sqr of newTetra) 
    {
        Game.tetramino[count].riga = sqr.riga;
        Game.tetramino[count].colonna = sqr.colonna;
        coloraCella(sqr.riga, sqr.colonna, SevenBag.tipoCorrente);
        count++;
    }
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

function calcolaRootRotazione() 
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
function provaRotazione(root) 
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

function trovaRigheRipulite() 
{
    let arrayRigheRipulite = new Array();
    let guardate = new Array();
    for (let sqr of Game.tetramino)
    {
        if(guardate.indexOf(sqr.riga) !== -1)
        { // non aggiungo righe duplicate
            continue;
        }
        guardate.push(sqr.riga);
        let trovatoVuoto = false;
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
    arrayRigheRipulite.sort();
    return arrayRigheRipulite;
}
// valuta se il tetramino t passato collide con qualcosa 
function collide(t) // Utility
{
    for(c of t)
    {
        // sarebbe fuori dalla scatola
        if(!isInBound(c.riga, c.colonna)) 
        {
            return true;
        }
        // collide con un altro caduto (sotto o laterale)
        if(getCell(c.riga, c.colonna).classList.contains("Caduto")) 
        {
            return true;
        }
    }
    return false;
}