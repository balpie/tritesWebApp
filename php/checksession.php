<?php
    session_start();
    $responseObj = new stdClass();
    if(!isset($_SESSION["login"]))
    {
        $responseObj->error = "nologin";
        echo json_encode($responseObj);
        return;
    }
    require_once("database.php");
    $connessione = mysqli_connect(DBHOST, DBUSER, DBPASS, DBNAME);
    if(mysqli_connect_errno()){
        $responseObj->error = "db_err";
        echo json_encode($responseObj);
        return;
    }
    require_once("userinfo.php");
    $responseObj = getUserInfo($connessione, $_SESSION["login"]);
    $responseObj->error = "no_err";
    
    echo json_encode($responseObj);
    mysqli_close($connessione);
?>