<!DOCTYPE html>

<html lang="it">
    <head>
        <meta charset="utf-8">
        <meta name="author" content="Pietro Balestri">
        <link rel="stylesheet" href="css/game.css">
        <link rel="stylesheet" href="css/navbar.css">
        <link rel="stylesheet" href="css/tetracolors.css">
        <script src="js/script.js"></script>
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
                <li><a href="php/guida.php">Guida</a></li>
                <li><a href="classifiche.php">Classifiche</a></li>
                <li><a href="login.php">Account</a></li>
            </ul>
        </nav>
        <main>
            <aside>
                <div id="HoldPreview">
                    <p>Preview:</p>
                    <div id="Preview" class="gameBoard"></div>
                    <p>Hold:</p>
                    <div id="Hold" class="gameBoard"></div>
                </div>
            </aside>
            <div id="gameContainer">
                <div id="gameBoard" class="gameBoard"></div>
            </div>
            <aside>
                <table id="GameStats">
                    <tr>
                        <th>Livello: </th>
                        <td id = "Livello" class="Stats">1</td>
                    </tr>
                    <tr>
                        <th>Linee: </th>
                        <td id = "Lines" class="Stats">0</td>
                    </tr>
                    <tr>
                        <th>Punti: </th>
                        <td id="Punti" class="Stats">0</td>
                    </tr>
                    <tr>
                        <td colspan="2" id="Status"></td>
                    </tr>
                </table>
                <button type="button" id="Start">Gioca</button>
                <button type="button" id="Restart">Ricomincia</button>
            </aside>
        </main>
    </body>
</html>
