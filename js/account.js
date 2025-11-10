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
                    document.getElementById("LogIn").className = "Nascosto";
                    e = document.createElement("p");
                    e.innerText = response[1];
                    document.getElementById("Wrapper").appendChild(e);
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
    console.log("WorkInProgress");
}