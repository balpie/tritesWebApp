<?php
    session_start();
    require_once("database.php");

    $connessione = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
    if($connessione->connect_errno) {
        echo "Failed to connect to MySQL: " . $connessione->connect_error;
        die("E' stato bello");
    }
    if(isset($_SESSION["login"]))
    {
        $username = $_SESSION["login"];
    }
    else
    {
        $username = "Anon";
    }
    $query = "INSERT INTO Partite(NomeUtente, LineeRipulite, Punti, DataPartita)
              VALUES(?, ?, ?, NOW())";
    $preparedQuery = mysqli_prepare($connessione, $query);
    mysqli_stmt_bind_param($preparedQuery, "sdd", $username, $_POST["LineeRipulite"], $_POST["Punti"]);
    mysqli_stmt_execute($preparedQuery);

    $result = $connessione->query($query);
?>