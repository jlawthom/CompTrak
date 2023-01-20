// let players = ["Kevin", "Murat", "Akhtar", "Isac", "Piere", "Matt", "Shalini", "Jonny", "Jack", "Bernie", "Bill", "Bob", "Ben", "Jim", "James", "Jan" ];
let playersObj = JSON.parse(sessionStorage.getItem('players'));
let players = [];
for (let p of playersObj) {
    players.push(p.name);
}

let tournId = sessionStorage.getItem('tournId');
let matchesDb = JSON.parse(sessionStorage.getItem('matches'));
let matches = [];
let tournCheck = 0;
if (matchesDb) {
    for (let i in matchesDb) {
        if (matchesDb[i][0].tournId == tournId) {
            matches.push(matchesDb[i]);
        }
    }
}
console.log("tournCheck: ", tournCheck);
console.log(matches);

const noOfPlayers = players.length;
let noOfCols = 1;
let noOfRows = 1;
let i = 2;
let qualifyingMatches = 0; 

while (i < noOfPlayers) {
    noOfCols = i/2;
    noOfRows += 2;
    i *= 2;
}
qualifyingMatches = noOfPlayers - (i/2);
console.log(qualifyingMatches);

function createPage() {
    const treeDiv = document.getElementById("tournamentTree");
    let singleRowCount = 0;
    let outsideRowCount = 0;  
    let matchId = 0;
    for (let i = 1; i <= noOfRows; i++){
        const rowDiv = createEl("div", treeDiv, null, 'row' + i, "row");
        let roundOf = 2*Math.pow(2, Math.abs(i - (noOfRows+1)/2));
        let qualifier = qualifyingMatches - roundOf/2;
        if (tournCheck == 0) {
            matches.push([]);
        }
        for (let j = 1; j <= noOfCols; j++) {
            const colDiv = createEl("div", rowDiv, null, "col" + i + "-" + j, "col");
            
            if (tournCheck == 0) {
                let match = {
                    matchId : matchId,
                    tournId : tournId,
                    player1 : "",
                    player2 : "",
                    cssRow : i,
                    cssCol : j
                }
                matches[i-1].push(match);
            } 

            listTextId = 'p-' + i + '-' + j + '-';
            if (i == 1 || i == noOfRows){
                if (outsideRowCount < qualifyingMatches) {
                    createMatch(colDiv, roundOf, qualifier, listTextId);
                    outsideRowCount++;             
                }
            } else {
                createMatch(colDiv, roundOf, 0, listTextId);
            }  
            matchId++;
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
    sessionStorage.setItem('matches', JSON.stringify(matches));
    //console.log(matches);
}

function createMatch(colDiv, roundOf, qualifier, listTextId) {

    // if (row % 2 == 1) {
    //     cardClass =  "card my-scheme-red mb-3";
    // } else {
    //     cardClass = "card my-scheme-yel mb-3";
    // }
    cardClass = "card my-scheme-secondary mb-3";
    cardDiv = createEl("div", colDiv, null, null, cardClass , null, "width: 9rem;");
    matchDiv = createEl("div",cardDiv, null, null, "card-header", "Round of " + roundOf);
    listUl = createEl("ul", cardDiv, null, null, "list-group list-group-flush");

    if (roundOf == 2) {
        matchDiv.innerText = "Final";
        matchDiv.setAttribute('id', 'bodyFinal');
        cardDiv.setAttribute('style', 'max-width: 20rem;');
        let listRow = createEl("div", listUl, null, "rowF", "row");
        for (let k=0; k<2; k++){
            let listCol = createEl("div", listRow, null, "col" + "F-" + k, "col");
            playerLi = createEl("li", listCol, null, listTextId + k, "list-group-item");
        }        
    } else {
        for (let k=0; k<2; k++){
            playerLi = createEl("li", listUl, null, listTextId + k, "list-group-item");
        }
    }    
    if (roundOf == 4) {matchDiv.innerText = "Semi Final";}
    if (roundOf == 8) {matchDiv.innerText = "Quarter Final";}
    if (qualifier) {matchDiv.innerText = "Qualifier";}
}

function fillInitialPlayers() {
    let matchCount = 1;
    let rowOrder = [1, noOfRows, noOfRows-1, 2];
    let rowIndex = 0;
    let col = 1;
    for (let p = 0; p < players.length; p += 2) {
        let row = rowOrder[rowIndex];
        console.log(row, col);
        matches[row-1][col-1].player2 = players[p];
        if (players[p+1]) {
            matches[row-1][col-1].player1 = players[p+1];
        }
                
        if (matchCount == qualifyingMatches) {
            console.log("to inner rows");
            rowIndex = 2;
            col = matches[rowOrder[rowIndex]].length/2;
        }
        else if (rowIndex == 0 && col == matches[row-1].length) {
            console.log("to last row");
            rowIndex++;
            col = 1;
        } else if ((rowIndex == 1 && col == matches[row-1].length) || (rowIndex ==2 && col == 1)) {
            rowIndex++;
            // console.log("rowInd", rowIndex);
            col = matches[rowOrder[rowIndex]-1].length;
        } else if (rowIndex <= 1) {
            col++;
        } else if (rowIndex >= 2) {
            col--;
        }
        matchCount++;
    }
}

function fillPlayers() {
    for (let i = 0; i < matches.length; i++) {
        for (let j = 0; j < matches[i].length; j++) {
            const {cssRow: r, cssCol: c, player1, player2} = matches[i][j];
            fillMatchPlayer(r, c, 0, player1);
            fillMatchPlayer(r, c, 1, player2);
        }
    }
    
    function fillMatchPlayer(row, col, player, name) {
        let id = 'p-' + row + '-' + col + '-' + player;
        // console.log(id, name);
        try {
            matchPlayer = document.getElementById(id);
            //console.log(name);
            if (name) {
                matchPlayer.setAttribute('class', 'list-group-item my-scheme-hover');
            }              
            matchPlayer.addEventListener('click', () => progressPlayer(row, col, name));
            matchPlayer.innerText = name;
        } catch {
            // console.log("no match");
        } 
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

    for (let i of matches) {
        for (let match of i) {
            if (match.cssRow == nextRow && match.cssCol == nextCol) {
                if (nextK == 0) {
                    match.player1 = player;
                } else {
                    match.player2 = player;
                }
            }
        }
    }
    fillPlayers();
    sessionStorage.setItem('matches', JSON.stringify(matches));
}

createPage();
fillInitialPlayers();
fillPlayers();
sessionStorage.setItem('matches', JSON.stringify(matches));
console.log(matches);
// progressPlayer(1, 1, "Joe");