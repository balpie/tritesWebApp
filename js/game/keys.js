function keyDownHandler(event) 
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
        default: 
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

function keyUpHandler(event) 
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
