<?php

    function getUserInfo($connection, $username)
    {
        $responseObj = new stdClass();
        $responseObj->username = $username;
        error_log("[getUserInfo]: responseObj.proprietaACaso".$responseObj->proprietaACaso);
        # Data Iscrizione
        $query = "SELECT DataIscrizione
            FROM Utenti
            WHERE NomeUtente = ?";
        $statement = mysqli_prepare($connection, $query); 
        mysqli_stmt_bind_param($statement, "s", $username);
        mysqli_stmt_execute($statement);
        $result = mysqli_stmt_get_result($statement);
        $responseObj->dataIscrizione = mysqli_fetch_assoc($result)["DataIscrizione"];
        # media punti
        $query = "SELECT AVG(Punti) AS MediaPunti
            FROM Partite
            WHERE NomeUtente = ?
            GROUP BY NomeUtente";
        $statement = mysqli_prepare($connection, $query); 
        mysqli_stmt_bind_param($statement, "s", $username);
        mysqli_stmt_execute($statement);
        $result = mysqli_stmt_get_result($statement);
        if(mysqli_num_rows($result) == 0)
        {
            # l'utente non ha giocato partite
            $responseObj->mediaPunti = null;
            $responseObj->posizioneClassifica = null;
            $responseObj->maxPunti = null;
            # $responseObj->partite = [];
            return $responseObj;
        }
        $responseObj->mediaPunti = mysqli_fetch_assoc($result)["MediaPunti"];
        $query = "SELECT RANK()OVER(ORDER BY Punti) as Posizione, MAX(Punti) as MaxPunti
            FROM Partite
            GROUP BY NomeUtente
            HAVING NomeUtente = ?"; // TODO test 
        $statement = mysqli_prepare($connection, $query); 
        mysqli_stmt_bind_param($statement, "s", $username);
        mysqli_stmt_execute($statement);
        $result = mysqli_stmt_get_result($statement);
        $row = mysqli_fetch_assoc($result);
        $responseObj->posizioneClassifica = $row["Posizione"];
        $responseObj->maxPunti = $row["MaxPunti"];
        
        return $responseObj;
    }
?>