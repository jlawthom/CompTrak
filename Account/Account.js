let userId = sessionStorage.getItem("userId");
if (!userId) {
    window.location = ACTIVE_DIR + LOGIN_HTML;
}
// Nav Paths
for (let i of document.getElementsByClassName("href-home")) {
    i.setAttribute("href", ACTIVE_DIR + HOME_HTML);
}

makeRequest("GET", ACTIVE_URL + API_CALLER + GET_USR_BY_ID + userId).then((val) => {
    const {password, userId, ...rest} = val;
    printUserDetails(rest)
})

let userDetails;

function printUserDetails(data) {
    userDetails = Object.entries(data);
    for (let entry of userDetails) {
        let contenteditable = "true";
        let entryKey = "";
        if (entry[0] == "firstName") {entryKey = "First Name"}
        if (entry[0] == "lastName") {entryKey = "Last Name"}
        if (entry[0] == "username") {entryKey = "Username"; contenteditable = "false"}
        if (entry[0] == "email") {entryKey = "Email Address"}

        let cardDiv = createEl("div", null, "user-details", null, "card border-dark my-4", null, "width: 500");
        let cardHeader = createEl("div", cardDiv, null, null, "card-header p-2");
        let detailsText = createEl("h4", cardHeader);
        detailsText.innerHTML = "<b>"+entryKey+"</b>";
        let cardBody = createEl("h5", cardDiv, null, entry[0], "card-body p-2", entry[1]);
        cardBody.setAttribute("contenteditable", contenteditable);
    }
}

function deleteAccount() {
    makeRequest("DELETE", ACTIVE_URL + API_CALLER + DEL_USER + userId).then(() => {
        signOut();
    })
}

function saveChanges() {
    console.log(userDetails);
    const userData = {};
    
    for (let entry of userDetails) {
        userData[entry[0]] = document.getElementById(entry[0]).innerText;
    }
    userData["password"] = "";
    console.log(userData);

    makeRequest("POST", ACTIVE_URL + API_CALLER + UPD_USER + userId, JSON.stringify(userData)).then(() => {
        window.location = ACTIVE_DIR + HOME_HTML;
    })
}

function signOut() {
    sessionStorage.clear();
    window.location = ACTIVE_DIR + LOGIN_HTML;
}