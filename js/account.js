document.addEventListener("DOMContentLoaded", checkSession);

const PrivateElements = [];

function checkSession()
{
    let xmlhttp = new XMLHttpRequest();
    let url = "checksession.php";
    xmlhttp.withCredentials = true;
    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200)
        {
            let response = xmlhttp.response;
            switch(response.error) // Indica l'errore o se è stato fatto il login
            {
                case "no_err":
                    clearForms(true);
                    printUserInfo(response);
                    break;
                default:
                    document.getElementById("LogIn").classList.remove("Nascosto");
            }
            xmlhttp.onreadystatechange = null;
        }
    }
    xmlhttp.responseType = "json";
    xmlhttp.send("");
}

function actionButton()
{
    document.getElementById("LogIn").classList.toggle("Nascosto");
    document.getElementById("SignUp").classList.toggle("Nascosto");
}
function tryLogIn()
{
    let xmlhttp = new XMLHttpRequest();
    let url = "login.php";
    let usrName = document.getElementById("Username").value;
    let password = document.getElementById("Password").value;
    let parameters = "username=" + usrName + "&password=" + password;
        // apro un post verso insertPartita.php in modo asincrono:
    xmlhttp.open("POST", url, true); 
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200)
        {
            let response = xmlhttp.response;
            console.log("[tryLogIn] server responds: "+response.error);
            switch(response.error) // Indica l'errore o se è stato fatto il login
            {
                case "no_err":
                    clearForms(true);
                    printUserInfo(response);
                    break;
                default:
                    clearForms(false);
                    document.getElementById("Error").innerText = response.error;
            }
        }
    }
    xmlhttp.responseType = "json";
    xmlhttp.send(parameters); 
}

function trySignUp()
{
    let xmlhttp = new XMLHttpRequest();
    let url = "signup.php";
    let usrName = document.getElementById("NewUsername").value;
    let password = document.getElementById("NewPassword").value;
    let confirmPassword = document.getElementById("ConfirmPassword").value;
    let parameters = "username=" + usrName + "&password=" + password + "&confirm=" + confirmPassword;
    xmlhttp.open("POST", url, true); 
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200)
        {
            let response = xmlhttp.response;
            console.log(response);
            switch(response.error) // Indica l'errore o se è stato fatto il login
            {
                case "no_err":
                    clearForms(true);
                    printUserInfo(response);
                    break;
                default:
                    clearForms(false);
                    document.getElementById("Error").innerText = response.error;
            }
        }
    }
    xmlhttp.responseType = "json";
    console.log("[signUp]: send()");
    xmlhttp.send(parameters); // asincrona di default
}

function clearForms(hide)
{
    document.getElementById("Error").innerText = "";
    login = document.getElementById("LogIn");
    signup = document.getElementById("SignUp");
    if(hide)
    {
        login.className = "Nascosto";
        signup.className = "Nascosto";
    }
    for (input of document.querySelectorAll("input"))
    {
        input.value = "";
    }
}

function logOut()
{
    xmlhttp = new XMLHttpRequest();
    url = "logout.php";
    console.log("[logOut]: send()");
    xmlhttp.open("POST", url, true);
    xmlhttp.send("");
    
    for (e of PrivateElements)
    {
        e.remove();
    }
    document.getElementById("LogIn").className = "";
    document.getElementById("SignUp").className = "Nascosto";
    document.getElementById("LogOut").classList.add("Nascosto");
}

// (array di stringhe) arr per array elementi di riga
// (bool) header indica se la riga è data o header
function creaRigaTabella(arr, header)
{
    let row = document.createElement("tr");
    for(let i in arr)
    {
        let cell =  document.createElement(header? "th" : "td");
        cell.innerText = arr[i];
        row.appendChild(cell);
    }
    return row;
}

function printUserInfo(serverResponse)
{
    console.log(serverResponse);
    let userPresentation = document.createElement("p");
    console.log(serverResponse.partite);
    userPresentation.innerText = "Username: "+serverResponse.username+" \nData iscrizione: "+ serverResponse.dataIscrizione;
 
    let noPartite = false;
    if(serverResponse.mediaPunti === null)
    {
        userPresentation.innerText += "\nNessuna partita giocata!\n Cliccare sul titolo in alto a sinistra per giocare";
        noPartite = true;
    }
    if(!noPartite)
    {
        userPresentation.innerText += "\nMedia punti: "+ serverResponse.mediaPunti + "\nPosizione classifica: " + serverResponse.posizioneClassifica + "\nMassimo punteggio raggiunto: " + serverResponse.maxPunti;
        let userTable = document.createElement("table");
        PrivateElements.push(userTable);
        let tbody = document.createElement("tbody");
        userTable.appendChild(tbody);
        tbody.appendChild(creaRigaTabella
            (["Nome Utente", "Righe Ripulite", "Punti", "Data e ora"]));
        for(let e of serverResponse.partite)
        {
            tbody.appendChild(creaRigaTabella(e, false));
        }
        let titolo = document.createElement("h2");
        titolo.innerHTML = "Migliori partite: ";
        PrivateElements.push(titolo);
        document.getElementById("Wrapper").prepend(userTable);
        document.getElementById("Wrapper").prepend(titolo);
    }

    PrivateElements.push(userPresentation);
    document.getElementById("LogOut").classList.remove("Nascosto");
    document.getElementById("Wrapper").prepend(userPresentation);

}