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
    document.getElementById("Error").innerText = "";
}
function tryLogIn()
{
    let xmlhttp = new XMLHttpRequest();
    let url = "login.php";
    let usrName = document.getElementById("Username").value;
    let password = document.getElementById("Password").value;
    if(!usrName || !password)
    {
        document.getElementById("Error").innerText = "Tutti i campi sono obbligatori";
    }
    let parameters = "username=" + usrName + "&password=" + password;
        // apro un post verso insertPartita.php in modo asincrono:
    xmlhttp.open("POST", url, true); 
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
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
    if(!usrName || !password || !confirmPassword)
    {
        document.getElementById("Error").innerText = "Tutti i campi sono obbligatori";
    }
    let parameters = "username=" + usrName + "&password=" + password + "&confirm=" + confirmPassword;
    xmlhttp.open("POST", url, true); 
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
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
                    clearForms(false);
                    document.getElementById("Error").innerText = response.error;
            }
        }
    }
    xmlhttp.responseType = "json";
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

function addListItem(list, text)
{
    let listElem = document.createElement("li");
    listElem.innerText = text;
    list.appendChild(listElem);
}

function printUserInfo(serverResponse)
{
    let userPresentation = document.createElement("ul");
    addListItem(userPresentation, `Username: ${serverResponse.username}`);
    addListItem(userPresentation, `Data iscrizione: ${serverResponse.dataIscrizione}`);

    let noPartite = false;
    if(serverResponse.mediaPunti === null)
    {
        addListItem(userPresentation, "Nessuna partita giocata!");;
        noPartite = true;
    }
    if(!noPartite)
    {
        addListItem(userPresentation, `Media punti: ${serverResponse.mediaPunti}`);
        addListItem(userPresentation, `Posizione classifica giocatori: ${serverResponse.posizioneClassifica}`);
        addListItem(userPresentation, `Massimo punteggio raggiunto: ${serverResponse.maxPunti}`);

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