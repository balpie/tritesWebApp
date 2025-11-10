<?php
    session_start();

    require_once("database.php");
    $connessione = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);
    if(mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_errno();
        die("E' stato bello");
    }
    $query = 
       "SELECT NomeUtente 
        FROM Utenti 
        WHERE NomeUtente = '" . $_POST["username"] . "' AND PasswordUtente = '" . $_POST["password"] . "'";
    error_log($query);
    $result = mysqli_query($connessione, $query);
    if(mysqli_num_rows($result) < 1)
    {
        echo "no_usr_";
        return;
    }
    echo "no_err-";
    echo "Cose relative all'utente appena trovato"
?>