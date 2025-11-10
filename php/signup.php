<?php
    session_start();
    error_log("Chiamato signup", 0);
    $passwordFilter = "/[a-zA-Z0-9_+#@<>'.',:;]{4,16}/";
    $usernameFilter = "/[a-zA-Z0-9_]{4,16}/";
    if(!preg_match($passwordFilter, $_POST["password"]))
    {
        echo "invalid_pass-";
        return;
    }
    if(!preg_match($usernameFilter, $_POST["username"]))
    {
        echo "invalid_username-";
        return;
    }
    if($_POST["password"] != $_POST["confirm"])
    {
        echo "psw_cnfrm_nomatch-";
        return;
    }
    # controllo se c'è:
    require_once("database.php");
    $connessione = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);
    if(mysqli_connect_errno()) {
        error_log(": " . mysqli_connect_errno());
        echo("dberr-");
        return;
    }
    $query = "SELECT NomeUtente FROM Utenti WHERE NomeUtente = '" . $_POST["username"] ."'";
    error_log($query);
    $risultato = mysqli_query($connessione, $query);
    if(mysqli_num_rows($risultato) != 0)
    {
        echo "username_taken-";
        return;
    }
    echo "no_err-";
    $insert = "INSERT INTO Utenti(NomeUtente, PasswordUtente, DataIscrizione)
            VALUES ('". $_POST["username"] . "', '" . $_POST["password"] ."', CURRENT_DATE)";
    $risultato = mysqli_query($connessione, $insert);
    // TODO ERROR CHECKING
    error_log($insert);
    $_SESSION["login"] = $_POST["username"];
?>