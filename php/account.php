<!DOCTYPE html>

<html lang="it">
    <head>
        <meta charset="utf-8">
        <meta name="author" content="Pietro Balestri">
        <link rel="stylesheet" href="../css/account.css">
        <link rel="stylesheet" href="../css/navbar.css">
        <link rel="stylesheet" href="../css/tetracolors.css">
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
        <form id="SignUp" method="POST">
            <label for="NewUsername">Inserire l'username:</label>
            <input type="text" id="NewUsername">
            <label for="NewPassword">Inserire la password:</label>
            <input type="password" id="NewPassword">
            <label for="ConfirmPassword">Confermare la password:</label>
            <input type="password" id="ConfirmPassword">
            <button type="submit">Iscriviti</button>
        </form>
        <form id="LogIn" method="POST">
            <label for="Username">Inserire l'username:</label>
            <input type="text" id="Username">
            <label for="Password">Inserire la password:</label>
            <input type="password" id="Password">
            <button type="submit">Accedi</button>
        </form>
        </main>
    </body>
</html>