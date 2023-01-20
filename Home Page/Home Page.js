let userId = sessionStorage.getItem("userId");
if (!userId) {
    window.location = ACTIVE_DIR + LOGIN_HTML;
}

let tournaments = [];
makeRequest("GET", ACTIVE_URL + API_CALLER + GET_TOURNAMENT + userId).then((value) => {
    tournaments = value;
    createPage()
});

// Nav Paths
for (let i of document.getElementsByClassName("href-home")) {
    i.setAttribute("href", ACTIVE_DIR + HOME_HTML);
}
for (let i of document.getElementsByClassName("href-account")) {
    i.setAttribute("href", ACTIVE_DIR + ACCOUNT_HTML);
}

function createPage() {
    if (!tournaments) {
        tournaments = [];
    }        
    for (let i of tournaments) {
        let cardDiv = createEl("div", null, "tournament-board", JSON.stringify(i), "card bg-light border-dark mx-5 mb-5", null, "width: fit-content; display: inline-block");
        let cardHeader = createEl("div", cardDiv, null, null, "card-header my-card-header");
        let cardText = createEl("div", cardHeader, null, null, null, i.tournamentName, "cursor: pointer; font-size: large");
        cardText.addEventListener('click', () => loadTournament(cardDiv));
        deleteBtn(cardHeader);
    }
}

function deleteBtn (nameDiv) {
    let nameBtn = createEl("button", nameDiv, null, null, "close");
    nameBtn.innerHTML = '<span aria-hidden="true">&times;</span>';
    nameBtn.setAttribute("onclick", "deleteTournament(this.parentNode.parentNode, this)");
}

function deleteTournament(delEl) {
    makeRequest("DELETE", ACTIVE_URL + API_CALLER + DEL_TOURNAMENT + JSON.parse(delEl.id).tournamentId).then(() => {
        window.location.href = ACTIVE_DIR + HOME_HTML;
    })
}

function newTournament() {
    sessionStorage.setItem("noOfTournaments", tournaments.length);
    window.location.href = ACTIVE_DIR + NEW_TOURNAMENT_TREE_HTML;
}

function loadTournament(data) {
    console.log(data)
    sessionStorage.setItem("tournamentId", JSON.stringify(JSON.parse(data.id).tournamentId));
    window.location.href = ACTIVE_DIR + TOURNAMENT_TREE_HTML;
}
