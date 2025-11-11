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
            let response = xmlhttp.response.split("-");
            switch(response[0]) // Indica l'errore o se è stato fatto il login
            {
                case "no_err":
                    console.log("[checkSession]: stampando userinfo dal server");
                    clearForms(response[1]);
                    printUserInfo(response[1]);
                    break;
                default:
                    console.log("[checkSession]:no_login");
                    document.getElementById("LogIn").classList.remove("Nascosto");
            }
            xmlhttp.onreadystatechange = null;
        }
    }
    console.log("[checkSession]: send()");
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
            let response = xmlhttp.response.split("-");
            console.log("[tryLogIn] server responds: "+response);
            switch(response[0]) // Indica l'errore o se è stato fatto il login
            {
                case "no_err":
                    clearForms();
                    printUserInfo(response[1]);
                    break;
                default:
                    console.log(response[0] + response[1]);
            }
        }
    }
    console.log("[tryLogIn]: send()");
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
            let response = xmlhttp.response.split("-");
            switch(response[0]) // Indica l'errore o se è stato fatto il login
            {
                case "no_err":
                    clearForms();
                    printUserInfo(response[1]);
                    break;
                default:
            }
        }
    }
    console.log("[signUp]: send()");
    xmlhttp.send(parameters); // asincrona di default
}

function clearForms()
{
    login = document.getElementById("LogIn");
    signup = document.getElementById("SignUp");
    login.className = "Nascosto";
    signup.className = "Nascosto";
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
    let newStuff = document.createElement("p");
    newStuff.innerText = serverResponse;
    newStuff.id = "private";
    document.getElementById("LogOut").classList.remove("Nascosto");
    document.getElementById("Wrapper").prepend(newStuff);

}