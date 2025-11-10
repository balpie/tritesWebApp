<!DOCTYPE html>

<html lang="it">
    <head>
        <meta charset="utf-8">
        <meta name="author" content="Pietro Balestri">
        <link rel="stylesheet" href="../css/classifiche.css">
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
            <?php
                session_start();
                function stampaRiga($utente, $punti, $linee, $data)
                {
                    echo "<tr>
                            <td>".$utente."</td>
                            <td>".$punti."</td>
                            <td>".$linee."</td>
                            <td>".date('d-m-Y', $data)."</td>
                          </tr>";
                }
                require_once("database.php");
                $connessione = new mysqli("localhost","root","","balestri_665384");
                if($mysqli->connect_errno) {
                    echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
                    die("E' stato bello");
                }
                
                if($result = $connessione->query("SELECT * FROM Partite ORDER BY Punti LIMIT 10"))
                {
                    echo "
                        <table>
                            <tr>
                                <th>Giocatore</th>
                                <th>Punti</th>
                                <th>Linee</th>
                                <th>Data</th>
                            </tr>";
                            while($riga = $result->fetch_object())
                            {
                                stampaRiga($riga->NomeUtente, $riga->Punti, $riga->LineeRipulite, $riga->data);
                            }
                            echo "</table>";
                }
                else{
                    echo '<p style="color: red;">Classifiche attualmente non disponibili<p>';
                }
            ?>
        </main>
    </body>
</html>
