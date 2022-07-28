//adb devices;  =>
var users = [];
var currentProfile = null;
var secondProfile = null;

function updateProfiles() {
  if (users.length != 0) {
    let profileList = JSON.stringify(users);
    localStorage.setItem("usuarios", profileList);
    let actual = JSON.stringify(currentProfile);
    localStorage.setItem("loggedUser", actual);
    let Sactual = JSON.stringify(secondProfile);
    localStorage.setItem("secondUser", Sactual);
  }
}

function selectingProfile(userNumber) {
  let storage = JSON.stringify("player" + userNumber);
  localStorage.setItem("choosing", storage);

  goProfile();
}

function getProfiles() {
  let userList = JSON.parse(localStorage.getItem("usuarios"));
  if (userList != null) {
    currentProfile = JSON.parse(localStorage.getItem("loggedUser"));
    users = userList;
    if (users.length > 1) {
      secondProfile = JSON.parse(localStorage.getItem("secondUser"));
    }
  }
}

function goProfile() {
  window.location.replace("profiles.html");
}

function playTicTacToe() {
  if (Valid()) {
    window.location.replace("tictactoe/index.html");
  } else {
    window.location.replace("profiles.html");
  }
}

function playMemotest() {
  if (Valid()) {
    window.location.replace("memotest/memotest.html");
  } else {
    window.location.replace("profiles.html");
  }
}

function playChess() {
  if (Valid()) {
    window.location.replace("chess/index.html");
  } else {
    window.location.replace("profiles.html");
  }
}

function Valid() {
  if (users != null && users.length > 0) {
    return true;
  } else {
    return false;
  }
}

function loadCurrentProfiles() {
  if (currentProfile != null) {
    document
      .getElementById("player1image")
      .setAttribute("src", currentProfile.profilepic);
    document.getElementById("player1namer").innerHTML = currentProfile.nick;
  }

  if (secondProfile != null) {
    document
      .getElementById("player2image")
      .setAttribute("src", secondProfile.profilepic);
    document.getElementById("player2namer").innerHTML = secondProfile.nick;
  }
}

/*function loadLeaderboard() {
  let posholder = [];
  for (let i = 0; i < users.length; i++) {
    posholder.push(users[i]);
  }
  posholder.sort(function (a, b) {
    let first = a.score1 + a.score2 + a.score3;
    let second = b.score1 + b.score2 + b.score3;
    if (second > first) {
      return 1;
    }
    if (first > second) {
      return -1;
    }
    return 0;
  });
  let elemen = document.getElementById("leaderboard");
  for (let i = 0; i < users.length; i++) {
    elemen.innerHTML +=
      '<tr class="leaderboarditem"><td><img class="leaderboardimage" alt="imagen de ' +
      posholder[i].nick +
      '" src="' +
      posholder[i].profilepic +
      '"></td><td class="leaderboardnick">' +
      posholder[i].nick +
      '</td><td class="leaderboardscore">' +
      (posholder[i].score1 * 50 + users[i].score2 + posholder[i].score3) +
      "</td></tr>";
  }
}*/

function UpdateUsedProfiles() {
  if (users.length > 0) {
    if (currentProfile == null) {
      FillPlayer(1, users[0]);
    } else {
      FillPlayer(1, currentProfile);
    }
    if (secondProfile == null) {
      FillPlayer(2, users[0]);
    } else {
      FillPlayer(2, secondProfile);
    }
  }
}

function FillPlayer(nro, data) {
  document
    .getElementById("player" + nro + "image")
    .setAttribute("src", data.profilepic);
  document.getElementById("player" + nro + "namer").innerHTML = data.nick;
}

function startup() {
  getProfiles();
  if ((users != null) & (users.length > 0)) {
    loadCurrentProfiles();
  }
}

startup();
