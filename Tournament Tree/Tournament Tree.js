let tournamentId = sessionStorage.getItem('tournamentId');
let matches = [];
let noOfColsMax = 1;
let noOfRows = 1;
let qualifyingMatches = 0;

let userId = sessionStorage.getItem("userId");
if (!userId) {
    window.location = ACTIVE_DIR + LOGIN_HTML;
}

// Nav Paths
for (let i of document.getElementsByClassName("href-home")) {
    i.setAttribute("href", ACTIVE_DIR + HOME_HTML);
}
for (let i of document.getElementsByClassName("href-players")) {
    i.setAttribute("href", "#");
}
for (let i of document.getElementsByClassName("href-account")) {
    i.setAttribute("href", ACTIVE_DIR + ACCOUNT_HTML);
}

// New or Load
if (tournamentId == 0) {
    makeRequest("GET", ACTIVE_URL + API_CALLER + GET_TOURNAMENT + userId).then((value) => {
        tournamentId = value[value.length-1].tournamentId++;
        sessionStorage.setItem("tournamentId", tournamentId);
        createMatches();
        createPage();
    })
} else {
    makeRequest("GET", ACTIVE_URL + API_CALLER + GET_MATCH + tournamentId).then((value) => {
        loadMatches(value);
        createPage();
    })
}

function createPage() {
    createMatchCards();
    fillPlayers();
}


function createMatches() {
    // Get player names
    let playersObj = JSON.parse(sessionStorage.getItem('players'));
    let players = [];
    for (let p of playersObj) {
        players.push(p.name);
    }

    // Get number of rows and columns
    const noOfPlayers = players.length;
    let i = 2; 

    while (i < noOfPlayers) {
        noOfColsMax = i/2;
        noOfRows += 2;
        i *= 2;
    }
    qualifyingMatches = noOfPlayers - (i/2);

    // Create Match objects
    let singleRowCount = 0;
    let noOfCols = noOfColsMax;
    for (let i = 1; i <= noOfRows; i++){
        let roundOf = 2*Math.pow(2, Math.abs(i - (noOfRows+1)/2));
        let qualifier = qualifyingMatches - roundOf/2;
        if (roundOf == 2) {roundLabel = "Final";} 
        else if (roundOf == 4) {roundLabel = "Semi Final";}
        else if (roundOf == 8) {roundLabel = "Quarter Final";}
        else {roundLabel = "Round of " + roundOf;}
        if ((i == 1 || i == noOfRows) && qualifier) {roundLabel = "Qualifier";}

        matches.push([]);
        for (let j = 1; j <= noOfCols; j++) {

            let match = {
                roundLabel : roundLabel,
                namePlayer1 : "",
                namePlayer2 : "",
                treeRow : i,
                treeCol : j,
                tournamentId : tournamentId
            }

            matches[i-1].push(match);
            
        }

        if (singleRowCount == 2) {
            noOfCols *= 2;
        }
        else if (noOfCols > 1) {
            noOfCols /= 2;
        } else {
            singleRowCount++;
        }
    }

    // Insert player names into match objects
    let matchCount = 1;
    let rowOrder = [1, noOfRows, noOfRows-1, 2];
    let rowIndex = 0;
    let col = 1;
    for (let p = 0; p < players.length; p += 2) {
        let row = rowOrder[rowIndex];
        matches[row-1][col-1].namePlayer2 = players[p];
        if (players[p+1]) {
            matches[row-1][col-1].namePlayer1 = players[p+1];
        }
        
        if (matchCount == qualifyingMatches) {
            rowIndex = 2;
            col = matches[rowOrder[rowIndex]].length/2;
        }
        else if (rowIndex == 0 && col == matches[row-1].length) {
            rowIndex++;
            col = 1;
        } else if ((rowIndex == 1 && col == matches[row-1].length) || (rowIndex ==2 && col == 1)) {
            rowIndex++;
            col = matches[rowOrder[rowIndex]-1].length;
        } else if (rowIndex <= 1) {
            col++;
        } else if (rowIndex >= 2) {
            col--;
        }
        matchCount++;
    }

    // Post matches to database
    for (let row of matches) {
        for (let match of row) {
            makeRequest("POST", ACTIVE_URL + API_CALLER + CRT_MATCH, JSON.stringify(match));
        }
    }
}

function loadMatches(data) {
    let maxRow = 0;
    for (let match of data) {
        let row = match.treeRow;
        while (row > maxRow) {
            matches.push([]);
            maxRow++;
        } 
        
        let colMax = matches[row-1].length;
        let col = match.treeCol;
        while (col > colMax) {
            matches[row-1].push("");
            colMax++;
        }
        matches[row-1][col-1] = match; 

        if (col > noOfColsMax) {
            noOfColsMax = col;
        }
        if (match.roundLabel == "Qualifier" && match.namePlayer2) {
            qualifyingMatches++;
        }
    }
    noOfRows = maxRow;
} 

function createMatchCards() {
    const treeDiv = document.getElementById("tournamentTree");
    let singleRowCount = 0;
    let outsideRowCount = 0;
    let noOfCols = noOfColsMax;
    for (let i = 1; i <= noOfRows; i++){
        const rowDiv = createEl("div", treeDiv, null, 'row' + i, "row");
        for (let j = 1; j <= noOfCols; j++) {
            const colDiv = createEl("div", rowDiv, null, "col" + i + "-" + j, "col");
            const match = matches[i-1][j-1];
            let cardPlayerId = 'p-' + i + '-' + j + '-';
            if ((i == 1 || i == noOfRows) && (outsideRowCount < qualifyingMatches)) {
                createMatch(colDiv, match, cardPlayerId);
                outsideRowCount++;
            } else if (!(i == 1 || i == noOfRows) || qualifyingMatches == 0) {
                createMatch(colDiv, match, cardPlayerId);
            }
        }

        if (singleRowCount == 2) {
            noOfCols *= 2;
        }
        else if (noOfCols > 1) {
            noOfCols /= 2;
        } else {
            singleRowCount++;
        }
    }
}

function createMatch(colDiv, match, id) {
    cardDiv = createEl("div", colDiv, null, null, "card my-scheme-secondary mb-3" , null, "width: 9rem;");
    matchDiv = createEl("div",cardDiv, null, null, "card-header");
    listUl = createEl("ul", cardDiv, null, null, "list-group list-group-flush");

    matchDiv.innerText = match.roundLabel;
    if (match.roundLabel == "Final") {
        matchDiv.setAttribute('id', 'bodyFinal');
        cardDiv.setAttribute('style', 'max-width: 20rem;');
        let listRow = createEl("div", listUl, null, "rowF", "row");
        for (let k=0; k<2; k++){
            let listCol = createEl("div", listRow, null, "col" + "F-" + k, "col");
            playerLi = createEl("li", listCol, null, id + k, "list-group-item");
        }        
    } else {
        for (let k=0; k<2; k++){
            playerLi = createEl("li", listUl, null, id + k, "list-group-item");
        }
    }
} 

function fillPlayers() {
    for (let i = 0; i < matches.length; i++) {
        for (let j = 0; j < matches[i].length; j++) {
            const {treeRow: r, treeCol: c, namePlayer1: p1, namePlayer2: p2} = matches[i][j];
            fillMatchPlayer(r, c, 0, p1);
            fillMatchPlayer(r, c, 1, p2);
        }
    }
    
    function fillMatchPlayer(row, col, player, name) {
        let id = 'p-' + row + '-' + col + '-' + player;
        try {
            matchPlayer = document.getElementById(id);
            if (name) {
                matchPlayer.setAttribute('class', 'list-group-item my-scheme-hover');
            }              
            matchPlayer.addEventListener('click', () => progressPlayerCheck(row, col, name));
            matchPlayer.innerText = name;
        } catch {
        } 
    }
}

function progressPlayerCheck(row, col, player) {
    if (matches[row-1][col-1].namePlayer1 && matches[row-1][col-1].namePlayer2) {
        progressPlayer(row, col, player);
    }
}

function progressPlayer(row, col, player) {
    let nextRow;
    let nextCol;
    let nextK;
    let middleRow = (noOfRows+1)/2;
    
    if (row < middleRow) {
        nextRow = row + 1;
    } else if (row > middleRow) {
        nextRow = row - 1;
    }

    if (col % 2 == 0) {
        nextCol = (col)/2;
        nextK = 1;
    } else {
        nextCol = (col+1)/2;
        nextK = 0;
    }

    if (row == middleRow - 1) {
        nextK = 0;

    } else if (row == middleRow + 1) {
        nextK = 1;
    }
    
    if (nextK == 0) {
        matches[nextRow-1][nextCol-1].namePlayer1 = player;
    } else {
        matches[nextRow-1][nextCol-1].namePlayer2 = player;
    }
    
    fillPlayers();
    // sessionStorage.setItem('matches', JSON.stringify(matches));

    // Update Database
    let matchIds = [];
    makeRequest("GET", ACTIVE_URL + API_CALLER + GET_MATCH + tournamentId).then((value) => {
        for (let dbMatch of value) {
            matchIds.push(dbMatch.matchId)
        }
        let matchIdCount = 0;
        for (let r in matches) {
            for (let c in matches[r]) {
                makeRequest("POST", ACTIVE_URL + API_CALLER + UPD_MATCH + matchIds[matchIdCount], JSON.stringify(matches[r][c]));
                matchIdCount++;
            }
        } 
    })    
}