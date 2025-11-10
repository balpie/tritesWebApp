CREATE DATABASE IF NOT EXISTS balestri_665384;
USE balestri_665384;

DROP TABLE IF EXISTS Utenti;

CREATE TABLE IF NOT EXISTS Utenti(
    `NomeUtente` VARCHAR(30) NOT NULL,
    `PasswordUtente` VARCHAR(64) NOT NULL, -- Hash with: "PASSWORD"
    `DataIscrizione` DATE NOT NULL,
    PRIMARY KEY(`NomeUtente`)
);

DROP TABLE IF EXISTS Partite;

CREATE TABLE IF NOT EXISTS Partite(
    `IdPartita` INTEGER NOT NULL AUTO_INCREMENT,
    `NomeUtente` VARCHAR(30) NOT NULL,
    `LineeRipulite` INTEGER NOT NULL,
    `Punti` INTEGER NOT NULL,
    `DataPartita` DATETIME NOT NULL,
    FOREIGN KEY(`NomeUtente`) REFERENCES `Utenti`(`NomeUtente`),
    PRIMARY KEY(`IdPartita`)
);
