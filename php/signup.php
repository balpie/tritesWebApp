<?php
    session_start();
    error_log("Chiamato signup", 0);
    $passwordFilter = "/[a-zA-Z0-9_+#@<>'.',:;]{4,16}/";
    $usernameFilter = "/[a-zA-Z0-9_]{4,16}/";
    if(!preg_match($passwordFilter, $_POST["password"]))
    {
        error_log("Errore password");
        echo "pass_error-";
        return;
    }
    if(!preg_match($usernameFilter, $_POST["username"]))
    {
        error_log("Errore password");
        echo "username_error-";
        return;
    }
?>