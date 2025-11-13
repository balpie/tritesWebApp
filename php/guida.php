<!DOCTYPE html>

<html lang="it">
    <head>
        <meta charset="utf-8">
        <meta name="author" content="Pietro Balestri">
        <link rel="stylesheet" href="../css/guida.css">
        <link rel="stylesheet" href="../css/navbar.css">
        <link rel="stylesheet" href="../css/tetracolors.css">
        <link rel="stylesheet" href="../css/footer.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
        <title>Trites</title>
    </head>
    <body>
        <nav>
            <h1>
                <a href="index.php">
                <span class="O">T</span><span class="I">r</span><span class="T">i</span><span class="Z">t</span><span class="S">e</span><span class="J">s</span>
                </a>
            </h1>
            <ul>
                <li><a href="guida.php">Guida</a></li>
                <li><a href="classifiche.php">Classifiche</a></li>
                <li><a href="account.php">Account</a></li>
            </ul>
        </nav>
        <main>
            <article>
                <h2>Guida all'utente</h2>
                <h3>Tasti: </h3>
                    <dl class="UserGuide">
                        <dt>A D</dt>
                            <dd>
                                Spostano il tetramino rispettivamente verso sinistra, e verso destra
                            </dd>
                        <dt>W</dt>
                            <dd>
                                Ruota il tetramino in senso orario
                            </dd>
                        <dt>S</dt>
                            <dd>
                                Fa cadere il tetramino più velocemente
                            </dd>
                        <dt>Enter</dt>
                            <dd>
                                Fa cadere il tetramino istantaneamente
                            </dd>
                        <dt>Shift Destro</dt>
                            <dd>
                                Mette il tetramino attualmente in caduta libera in "hold". Se 
                                presente un tetramino in hold, questo andrà in caduta libera a 
                                partire dalla cima della scatola, altrimenti il tetramino in caduta libera 
                                sarà il prossimo, visibile in "preview"
                            </dd>
                    </dl>
                <h3>
                    Meccaniche di gioco
                </h3>
                <dl>
                    <dt>Tetramini</dt>
                        <dd>
                            In Tetris esistono 7 diversi tipi di pezzi, detti Tetramini, ognuno nominato 
                            con la lettera alla quale somiglia: 
                            <br>
                <span class="O">O</span>, <span class="I">I</span>, <span class="T">T</span>, <span class="Z">Z</span>, <span class="S">S</span>, <span class="J">J</span>, <span class="L">L</span>
                        <dd>
                    <dt>Punteggi</dt>
                        <dd>
                            Si vincono punti riempiendo intere righe della scatola. Maggiore è il livello, più punti vengono assegnati.
                            Un altro modo di vincere punti è far scendere velocemente i tetramini, col tasto <span class="T">S</span> o <span class="T">Enter</span>
                        </dd> 
                    <dt>Scelta del prossimo tetramino</dt>
                        <dd>
                            La scelta del tetramino successivo non è completamente casuale, ma è
                            stato adottato l'algoritmo 7-bag: il prossimo tetramino viene estratto da 
                            una lista da 7 tetramini, che viene rimescolata ogni volta che termina.
                        </dd>
                    <dt>Rotazione: Wall Kick</dt>
                        <dd>
                            La rotazione non è sempre una rotazione pura: quando il tetramino potrebbe ruotare se fosse spostato di 1 
                            casella a destra o sinistra, ma non può ruotare nella posizione attuale senza collidere
                            con un tetramino già caduto, o uscire dalla scatola, viene eseguita una traslazione.
                        </dd>
                </dl>
            </article>
        </main>
        <footer>Progetto creato da Pietro Balestri per il corso di Progettazione Web</footer>
    </body>
</html>
