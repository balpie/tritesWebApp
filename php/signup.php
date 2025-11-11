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

    $query = "SELECT NomeUtente FROM Utenti WHERE NomeUtente = ?";
    $preparedQuery = mysqli_prepare($connessione, $query);
    mysqli_stmt_bind_param($preparedQuery, "s", $_POST["username"]);
    error_log($query);
    mysqli_stmt_execute($preparedQuery);
    $risultato = mysqli_stmt_get_result($preparedQuery);
    if(mysqli_num_rows($risultato) != 0)
    {
        echo "username_taken-";
        return;
    }
    $insert = "INSERT INTO Utenti(NomeUtente, PasswordUtente, DataIscrizione)
        VALUES (?, ?, CURRENT_DATE)";
    $preparedInsert = mysqli_prepare($connessione, $insert);
    mysqli_stmt_bind_param($preparedInsert, "ss", $_POST["username"], password_hash($_POST["password"], PASSWORD_DEFAULT));
    mysqli_stmt_execute($preparedInsert);
    error_log($insert);
    if(mysqli_stmt_affected_rows($preparedInsert) != 1)
    {
        echo "errore_insert-";
        mysqli_close($connessione);
        return;
    }
    echo "no_err-";
    require_once("userinfo.php");
    $_SESSION["login"] = $_POST["username"];
    error_log("[signup.php]: Chiamo printUserInfo");
    $str = getUserInfo($connection, $_SESSION["login"]);
    error_log("Stringa passata da getUserInfo" . $str);
    echo $str;
    mysqli_close($connessione);
?>