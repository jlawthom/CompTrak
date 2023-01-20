function loginPage() {
    window.location = ACTIVE_DIR + LOGIN_HTML;
}

function handleSubmit(data) {
    const userData = {};
    for (let element of data.elements) {
        if(element.id) {
            userData[element.id] = element.value;
        }
    }

    makeRequest("POST", ACTIVE_URL + API_CALLER + CRT_USER, JSON.stringify(userData)).then((val) => {
        console.log(val);
        if (val == "Username Taken") {
            document.getElementById("username").setAttribute("class", "form-control my-inputs is-invalid");
            document.getElementById("username-error").innerText = "Username Taken";
        } else {
            loginPage();
        }
    })

    return false;
}