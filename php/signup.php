<?php
    session_start();
    $responseObj = new stdClass();

    # verifica parametri
    $passwordFilter = "/^[a-zA-Z0-9_+#@<>'.,:;]{4,16}$/";
    $usernameFilter = "/^[a-zA-Z0-9_]{4,16}$/";
    if(!preg_match($passwordFilter, $_POST["password"]))
    {
        $responseObj->error = "Password non accettabile";
        echo json_encode($responseObj);
        return;
    }
    if(!preg_match($usernameFilter, $_POST["username"]))
    {
        $responseObj->error = "Username non accettabile";
        echo json_encode($responseObj);
        return;
    }
    if($_POST["password"] != $_POST["confirm"])
    {
        $responseObj->error = "Password errata";
        echo json_encode($responseObj);
        return;
    }
    require_once("database.php");
    $connessione = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);
    if(mysqli_connect_errno()) {
        $responseObj->error = "Errore database";
        echo json_encode($responseObj);
        return;
    }
    # Controllo esistenza username
    $username = $_POST["username"];
    $query = "SELECT NomeUtente FROM Utenti WHERE NomeUtente = ?";
    $preparedQuery = mysqli_prepare($connessione, $query);
    mysqli_stmt_bind_param($preparedQuery, "s", $username);
    mysqli_stmt_execute($preparedQuery);
    $risultato = mysqli_stmt_get_result($preparedQuery);
    if(mysqli_num_rows($risultato) != 0)
    {
        $responseObj->error = "Nome utente già preso";
        echo json_encode($responseObj);
        return;
    }
    # Inserisco nuovo utente 
    $insert = "INSERT INTO Utenti(NomeUtente, PasswordUtente, DataIscrizione)
        VALUES (?, ?, CURRENT_DATE)";
    $preparedInsert = mysqli_prepare($connessione, $insert);
    mysqli_stmt_bind_param($preparedInsert, "ss", $_POST["username"], password_hash($_POST["password"], PASSWORD_DEFAULT));
    mysqli_stmt_execute($preparedInsert);
    if(mysqli_stmt_affected_rows($preparedInsert) != 1)
    {
        $responseObj->error = "Impossibile aggiungere l'utente";
        echo json_encode($responseObj);
        return;
    }
    # aggiorno sessione
    $_SESSION["login"] = $_POST["username"];
    require_once("userinfo.php");
    $responseObj = getUserInfo($connessione, $_SESSION["login"]);
    $responseObj->error = "no_err";
    echo json_encode($responseObj);
    mysqli_close($connessione);
?>
