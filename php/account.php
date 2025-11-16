<!DOCTYPE html>

<html lang="it">
    <head>
        <meta name="author" content="Pietro Balestri">
        <link rel="stylesheet" href="../css/account.css">
        <link rel="stylesheet" href="../css/navbar.css">
        <link rel="stylesheet" href="../css/tabelle.css">
        <link rel="stylesheet" href="../css/footer.css">
        <link rel="stylesheet" href="../css/tetracolors.css">
        <script src="../js/account.js"></script>
        <!-- Codice preso da fonts.google.com -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
        <!-- fine codice di fonts.google.com -->
        <link rel="icon" type="image/x-icon" href="../img/favicon.png">
        <title>Trites</title>
    </head>
    <body>
        <nav>
            <h1>
                <a href="gioca.php">
                <span class="O">T</span><span class="I">r</span><span class="T">i</span><span class="Z">t</span><span class="S">e</span><span class="J">s</span>
                </a>
            </h1>
            <ul>
                <li><a href="gioca.php">Gioca</a></li>
                <li><a href="guida.php">Guida</a></li>
                <li><a href="classifiche.php">Classifiche</a></li>
                <li><a href="account.php" class="PaginaAttuale">Account</a></li>
            </ul>
        </nav>
        <main id="Wrapper">
            <form id="SignUp" class="Nascosto" class="Nascosto">
                <label for="NewUsername">Inserire l'username:</label>
                <input type="text" id="NewUsername" name="username">
                <label for="NewPassword">Inserire la password:</label>
                <input type="password" id="NewPassword" name="password">
                <label for="ConfirmPassword">Confermare la password:</label>
                <input type="password" id="ConfirmPassword" name = "confirm">
                <button type="button" onclick="trySignUp()">Iscriviti</button>
                se hai già un account: <span id="logInBtn" class="Cliccabile" onclick="actionButton()">log in</span>
            </form>
            <form id="LogIn">
                <label for="Username">Inserire l'username:</label>
                <input type="text" id="Username" name="username">
                <label for="Password">Inserire la password:</label>
                <input type="password" id="Password" name="password">
                <button type="button" onclick="tryLogIn()">Accedi</button>
                Se non hai un account: <span id="SignUpBtn" class="Cliccabile" onclick="actionButton()">iscriviti</span>
                <br><br>
            </form>
                <p id="Error"></p>
            <button id="LogOut" class="Nascosto" type="button" onclick="logOut()">Log Out</button>
        </main>
        <footer>Progetto creato da Pietro Balestri per il corso di Progettazione Web</footer>
    </body>
</html>