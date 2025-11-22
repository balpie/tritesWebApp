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
        # Posizione in classifica giocatori
        $responseObj->mediaPunti = mysqli_fetch_assoc($result)["MediaPunti"];
        $query = "WITH MaxPts AS
            (
                SELECT MAX(Punti) as MaxPunti, NomeUtente
                FROM Partite
                GROUP BY NomeUtente
            ),
            PosizMaxPts AS
            (
                SELECT RANK()OVER(ORDER BY MaxPunti DESC) as Posizione, MaxPunti, NomeUtente
                FROM MaxPts
            )
            SELECT Posizione, MaxPunti
            FROM PosizMaxPts
            WHERE NomeUtente = ?"; 
        $statement = mysqli_prepare($connection, $query); 
        mysqli_stmt_bind_param($statement, "s", $username);
        mysqli_stmt_execute($statement);
        $result = mysqli_stmt_get_result($statement);
        $row = mysqli_fetch_assoc($result);
        $responseObj->posizioneClassifica = $row["Posizione"];
        $responseObj->maxPunti = $row["MaxPunti"];
        # Query migliori 5 partite dell'utente
        $query = "SELECT NomeUtente, LineeRipulite, Punti, DataPartita
            FROM Partite
            WHERE NomeUtente = ?
            ORDER BY Punti DESC
            LIMIT 5"; 
        $statement = mysqli_prepare($connection, $query); 
        mysqli_stmt_bind_param($statement, "s", $username);
        mysqli_stmt_execute($statement);
        $result = mysqli_stmt_get_result($statement);
        $arrPartite = [];
        while($row = mysqli_fetch_assoc($result))
        {
            array_push($arrPartite, $row);
        }
        $responseObj->partite = $arrPartite;
        return $responseObj;
    }
?>