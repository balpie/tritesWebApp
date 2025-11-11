<?php
    session_start();

    require_once("database.php");
    $connessione = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);
    if(mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_errno();
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
        echo "no_user-";
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
        echo "no_err-" . getUserInfo($connessione, $username);
        error_log("[login.php]: ". getUserInfo($connessione, $username));
    }
    else
    {
        echo "wrong_password-";
    }
    mysqli_close($connessione);
?>