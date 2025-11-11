<?php
    session_start();

    $responseObj = new stdClass();

    require_once("database.php");
    $connessione = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);
    if(mysqli_connect_errno()) {
        $responseObj->error = "Errore interno al DataBase";
        echo json_encode($responseObj);
        die("ERR");
    }

    $query = 
       "SELECT NomeUtente, PasswordUtente 
        FROM Utenti 
        WHERE NomeUtente = ?";
    $statement = mysqli_prepare($connessione, $query);
    mysqli_stmt_bind_param($statement, "s", $_POST["username"]);
    mysqli_stmt_execute($statement);

    $risultato = mysqli_stmt_get_result($statement);

    if (mysqli_num_rows($risultato) != 1) // al massimo uno perchè sto controllando sulla chiave primaria
    {
        $responseObj->error = "Utente Inesistente";
        echo json_encode($responseObj);
        return;
    }
    // una sola volta tanto è
    $row = mysqli_fetch_assoc($risultato);
    $username = $row["NomeUtente"];
    $password = $row["PasswordUtente"];

    if(password_verify($_POST["password"], $password))
    {
        $_SESSION["login"] = $username;
        require_once("userinfo.php");
        $responseObj = getUserInfo($connessione, $username);
        $responseObj->error = "no_err";
        echo json_encode($responseObj);
        
    }
    else
    {
        $responseObj->error = "Password Sbagliata";
        echo json_encode($responseObj);
    }
    mysqli_close($connessione);
?>