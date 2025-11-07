<!DOCTYPE html>

<html lang="it">
    <head>
        <meta charset="utf-8">
        <meta name="author" content="Pietro Balestri">
        <link rel="stylesheet" href="../css/style.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
        <title>Trites</title>
    </head>
    <body>
        <nav>
            <h1>
                <a href="homepage.php">
                <span class="O">T</span><span class="I">r</span><span class="T">i</span><span class="Z">t</span><span class="S">e</span><span class="J">s</span>
                <a>
            </h1>
            <ul>
                <li><a href="../index.php">Gioca</a></li>
                <li><a href="classifiche.php">Classifiche</a></li>
                <li><a href="login.php">Account</a></li>
            </ul>
        </nav>
        <main>
            <article>
                <h2>Guida all'utente</h2>
                <h3>Tasti: </h3>
                <p>
                    <dl class="UserGuide">
                        <dt>A, D</dt>
                            <dd>
                                Spostano il tetramino rispettivamente verso sinistra, e verso destra
                            </dd>
                        <dt>W</dt>
                            <dd>
                                Ruota il tetramino in senso orario
                            </dd>
                        <dt>S</dt>
                            <dd>
                                Fa cadere il tetramino più velocemente. 
                                Se mentre si blocca è ancora tenuto premuto, verranno assegnati 5 * aunti livello
                            </dd>
                        <dt>Enter</dt>
                            <dd>
                                Fa cadere il tetramino istantaneamente. Quando premuto vengono assegnati 10 
                                punti * livello
                            </dd>
                        <dt>Shift Destro</dt>
                            <dd>
                                Mette il tetramino attualmente in caduta libera in "hold". Se 
                                presente un tetramino in hold, questo andrà in caduta libera a 
                                partire dalla cima della scatola, altrimenti il tetramino in caduta libera 
                                sarà il prossimo, visibile in "preview"
                            </dd>
                    </dl>
                </p>
            </article>
        </main>
    </body>
</html>
