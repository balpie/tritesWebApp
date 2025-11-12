<!DOCTYPE html>

<html lang="it">
    <head>
        <meta charset="utf-8">
        <meta name="author" content="Pietro Balestri">
        <link rel="stylesheet" href="../css/classifiche.css">
        <link rel="stylesheet" href="../css/tabelle.css">
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
            <h2>Classifica per partite</h2>
            <?php
                session_start();
                function stampaRiga($arr)
                {
                    echo "<tr>";
                    foreach($arr as $i)
                    {
                            echo "<td>".$i."</td>";
                    }
                    echo "</tr>";
                }
                function stampaHeader($arr)
                {
                    echo "<tr>";
                    foreach($arr as $i)
                    {
                            echo "<th>".$i."</th>";
                    }
                    echo "</tr>";
                }
                require_once("database.php");
                $connessione = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);
                if(mysqli_connect_errno()) {
                    echo "Failed to connect to MySQL: " . mysqli_connect_errno();
                    die("E' stato bello");
                }
                
                $query = "SELECT * FROM Partite ORDER BY Punti DESC LIMIT 25";
                if($result = mysqli_query($connessione, $query))
                {
                    $header = ["Giocatore", "Punti", "Livello", "Linee", "Data", "Ora"];
                    echo "<table>";
                    stampaHeader($header);
                        while($riga = $result->fetch_object())
                        {

                            $dataP = date('d-m-Y', strtotime($riga->DataPartita));
                            $oraP = date('G:i:s', strtotime($riga->DataPartita));
                            $livello = intdiv($riga->LineeRipulite,5)+1;
                            stampaRiga([$riga->NomeUtente, $riga->Punti, $livello, $riga->LineeRipulite, $dataP, $oraP]);
                        }
                        echo "</table>";
                }
                else{
                    echo '<p style="color: red;">Classifiche attualmente non disponibili<p>';
                }
            ?>
            <h2>Classifica per giocatori</h2>
            <?php
                $query = 
                    "SELECT NomeUtente, MAX(Punti) AS MaxPunti 
                    FROM Partite 
                    GROUP BY NomeUtente 
                    ORDER BY MaxPunti DESC LIMIT 25";
                if($result = mysqli_query($connessione, $query))
                {
                    $header = ["Giocatore", "Massimo Punteggio"];
                    echo "<table>";
                    stampaHeader($header);
                        while($riga = $result->fetch_object())
                        {
                            stampaRiga([$riga->NomeUtente, $riga->MaxPunti]);
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
