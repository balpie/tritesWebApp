<?php
    session_start();
    error_log("Eseguo codice insertPartita\n", 0);
    require_once("database.php");

    $connessione = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
    if($connessione->connect_errno) {
        echo "Failed to connect to MySQL: " . $connessione->connect_error;
        die("E' stato bello");
    }

    $query = "INSERT INTO Partite(NomeUtente, LineeRipulite, Punti, DataPartita)
              VALUES ('Anon'," . $_POST["LineeRipulite"] . "," . $_POST["Punti"]. ", CURRENT_DATE)"; 

    error_log("Query: `" . $query . "`", 0);
    $result = $connessione->query($query);
?>