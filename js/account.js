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
    console.log(`[tryLogIn]: ${usrName}, ${password}`);
    let parameters = "username=" + usrName + "&password=" + password;
        // apro un post verso insertPartita.php in modo asincrono:
    xmlhttp.open("POST", url, true); 
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200)
        {
            console.log(xmlhttp.response);
            response = xmlhttp.response.split("-");
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
    xmlhttp.send(parameters); // asincrona di default
}

function trySignUp()
{
    let xmlhttp = new XMLHttpRequest();
    let url = "signup.php";
    let usrName = document.getElementById("NewUsername").value;
    let password = document.getElementById("NewPassword").value;
    let confirmPassword = document.getElementById("ConfirmPassword").value;
    console.log(`[tryLogIn]: ${usrName}, ${password}`);
    let parameters = "username=" + usrName + "&password=" + password + "&confirm=" + confirmPassword;
    xmlhttp.open("POST", url, true); 
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200)
        {
            console.log(xmlhttp.response);
            response = xmlhttp.response.split("-");
            switch(response[0]) // Indica l'errore o se è stato fatto il login
            {
                case "no_err":
                    clearForms(response[1]);
                    printUserInfo(response);
                    break;
                default:
                    console.log("Server error: "+response[0]);
            }
        }
    }
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

//chiama al logout
function compariForms()
{
    document.getElementById("LogIn").className = "";
    document.getElementById("SignUp").className = "Nascosto";
}

function printUserInfo(serverResponse)
{
    newStuff = document.createElement("p");
    newStuff.innerText = serverResponse;
    document.getElementById("Wrapper").appendChild(newStuff);
}