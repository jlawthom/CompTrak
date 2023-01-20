let userId = sessionStorage.getItem('userId');
let playerCount = 0;
let colCount = 1;
let rowCount = 1;

active_dir = location.href.split("New")[0];

let isLoggedIn = sessionStorage.getItem('isLoggedIn');
if(!isLoggedIn || isLoggedIn === 'false') {
  window.location = active_dir + LOGIN_HTML;
}

// Nav Paths
for (let i of document.getElementsByClassName("href-home")) {
  i.setAttribute("href", active_dir + HOME_HTML);
}
for (let i of document.getElementsByClassName("href-account")) {
  i.setAttribute("href", active_dir + ACCOUNT_HTML);
}

let noOfTournaments = sessionStorage.getItem("noOfTournaments");
noOfTournaments++;
document.getElementById("tourn-name").innerText = "Tournament " + noOfTournaments;

function deleteBtn(nameDiv) {
  let nameBtn = createEl("button", nameDiv, null, null, "close");
  nameBtn.innerHTML = '<span aria-hidden="true">&times;</span>';
  nameBtn.setAttribute("onclick", "deletePlayer(this.parentNode.parentNode, this)");
}

function addPlayer(form) {
  let pn = form.elements[0].value.split(" ");
  let newPN = "";
  for (let i in pn) {
    newPN += pn[i].charAt(0).toUpperCase() + pn[i].slice(1) + " ";
  }
  playerName = newPN;

  if (playerName != " ") {
    playerCount++;

    if (playerCount == 4) {
      let btnCreate = document.getElementById("btn-create-tournament");
      let createDiv = document.getElementById("create-tournament");
      createDiv.removeChild(btnCreate);

      let btnNew = createEl("button", createDiv, null, "btn-create-tournament-active", "btn my-btn-active mt-5 btn-lg", "Create Tournament >");
      btnNew.setAttribute("onclick", "createTournament()");
    }

    let cardEl = document.getElementById("card1-1");
    let row = 1;
    let col = 1;
    while (cardEl) {
      col = 0;
      while (col <= 3 && cardEl) {
        col++;
        cardEl = document.getElementById("card" + row + "-" + col);
        rowCount = row;
        colCount = col;
      }
      row++;
    }
    let rowDiv = document.getElementById("row" + rowCount);
    if (!rowDiv) {
      rowDiv = createEl("div", null, "players", "row" + rowCount, "row");
      for (let i = 1; i <= 4; i++) {
        createEl("div", rowDiv, null, "col" + rowCount + "-" + i, "col");
      }
    }

    let cardDiv = createEl("div", null, "col" + rowCount + "-" + colCount, "card" + rowCount + "-" + colCount, "card bg-light border-dark mb-5", null, "width: fit-content;");
    let headerDiv = createEl("div", cardDiv, null, null, "card-header my-card-header", null);
    let nameDiv = createEl("div", headerDiv, null, "name" + rowCount + "-" + colCount, null, playerName, "font-size: large");
    nameDiv.setAttribute("contenteditable", "true");
    deleteBtn(headerDiv);
  }

  form.reset();
  return false;
}

function deletePlayer(delEl) {
  playerCount--;
  delEl.parentNode.removeChild(delEl);

  if (playerCount == 3) {
    let btnCreate = document.getElementById("btn-create-tournament-active");
    let createDiv = document.getElementById("create-tournament");
    createDiv.removeChild(btnCreate);

    let btnNew = createEl("button", createDiv, null, "btn-create-tournament", "btn btn-secondary mt-5 btn-lg", "Create Tournament >");
    btnNew.setAttribute("disabled", "");
  }
}

function createTournament() {
  let players = [];
  let nameEl = document.getElementById("name1-1");
  let row = 1;
  let col = 1;
  while (nameEl) {
    col = 0;
    while (col <= 3 && nameEl) {
      col++;
      nameEl = document.getElementById("name" + row + "-" + col);
      if (nameEl) {
        let player = {
          name: nameEl.innerText
        }
        players.push(player);
      }
    }
    row++;
  }
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  players = shuffleArray(players);

  let tournamentName = document.getElementById("tourn-name").innerText
  let tournamentData = {
    tournamentName: tournamentName,
    userId: userId
  };

  sessionStorage.setItem('newTournament', true);
  sessionStorage.setItem('players', JSON.stringify(players));
  makeRequest("POST", CRT_TOURNAMENT + API_CALLER + "tournaments", JSON.stringify(tournamentData)).then((response) => {
    sessionStorage.setItem('tournamentId', response.tournamentId);
    window.location.href = active_dir + TOURNAMENT_TREE_HTML;
  });

}
