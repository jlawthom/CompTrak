// Set redirect to Auth0 login
// window.location = "https://comp-trak.eu.auth0.com/authorize?response_type=code&client_id=ogt7KVEGbqnJjQ6esP1WHF7m7gGD3Gf4&redirect_uri=https://jlawthom.github.io/lawthom-tech/CompTrak/Auth/Login_Redirect.html&scope=openid";
window.location = "https://comp-trak.eu.auth0.com/authorize?response_type=id_token&client_id=ogt7KVEGbqnJjQ6esP1WHF7m7gGD3Gf4&redirect_uri=https://jlawthom.github.io/lawthom-tech/CompTrak/Auth/Login_Redirect.html&nonce=NONCE";

function registerPage() {
    window.location = active_dir + REGISTER_HTML;
}

function handleLogin(data) {
    const username = data.elements["username"].value;
    const password = data.elements["password"].value;

    makeRequest("GET", ACTIVE_URL + API_CALLER + LOGIN_USER + username + "/" + password)
    .then((val) => {
        if (val == "Invalid Username") {
            document.getElementById("username").setAttribute("class", "form-control my-inputs is-invalid")
            document.getElementById("username-error").innerText = "Invalid Username";
            document.getElementById("password").setAttribute("class", "form-control my-inputs")
            document.getElementById("password-error").innerText = "";
            console.log(val);
        } else if (val == "Invalid Password") {
            document.getElementById("username").setAttribute("class", "form-control my-inputs")
            document.getElementById("username-error").innerText = "";
            document.getElementById("password").setAttribute("class", "form-control my-inputs is-invalid")
            document.getElementById("password-error").innerText = "Invalid Password";
            console.log(val);
        } else {
            sessionStorage.setItem("userId", JSON.stringify(val));
            window.location = active_dir + HOME_HTML;
        }
        })
    return false;
}