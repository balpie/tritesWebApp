<?php
    session_start();
    require_once("database.php");

    $connessione = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);
    if(mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . $connessione->connect_error;
        return;
    }
    if(isset($_SESSION["login"]))
    {
        $username = $_SESSION["login"];
    }
    else
    {
        return;
    }
    $query = "INSERT INTO Partite(NomeUtente, LineeRipulite, Punti, DataPartita)
              VALUES(?, ?, ?, NOW())";
    $preparedQuery = mysqli_prepare($connessione, $query);
    mysqli_stmt_bind_param($preparedQuery, "sdd", $username, $_POST["LineeRipulite"], $_POST["Punti"]);
    mysqli_stmt_execute($preparedQuery);

    $result = $connessione->query($query);
?>