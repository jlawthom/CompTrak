function registerPage() {
    window.location = ACTIVE_DIR + REGISTER_HTML;
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
            window.location = ACTIVE_DIR + HOME_HTML;
        }
        })
    return false;
}