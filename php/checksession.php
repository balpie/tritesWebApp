<?php
    session_start();
    error_log("[userinfo.php]variabile \$_SESSION[\"login\"]: " . $_SESSION["login"]);
    if(!isset($_SESSION["login"]))
    {
        echo "nologin-";
        return;
    }
    echo "no_err-";
    echo getUserInfo("connessione al db", $_SESSION["login"]);
    // altrimenti fai query per roba utente
?>