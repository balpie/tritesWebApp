document.addEventListener("DOMContentLoaded", checkSession);

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
    document.getElementById("private").remove();
    document.getElementById("LogIn").className = "";
    document.getElementById("SignUp").className = "Nascosto";
    document.getElementById("LogOut").classList.add("Nascosto");
}

function printUserInfo(serverResponse)
{
    console.log(serverResponse);
    let newStuff = document.createElement("p");
    //TODO: fix layout
    newStuff.innerText = "Username: "+serverResponse.username+"\nData iscrizione: "+ serverResponse.dataIscrizione + "\nMedia punti: "+ serverResponse.mediaPunti + "\nPosizione classifica: " + serverResponse.posizioneClassifica + "\nMassimo punteggio raggiunto: " + serverResponse.maxPunti;
    newStuff.id = "private";
    document.getElementById("LogOut").classList.remove("Nascosto");
    document.getElementById("Wrapper").prepend(newStuff);

}