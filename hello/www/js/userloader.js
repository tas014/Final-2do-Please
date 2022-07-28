
function getPlayers() {
    const playerOne = JSON.parse(localStorage.getItem("loggedUser"));
    const playerTwo = JSON.parse(localStorage.getItem("secondUser"));

    if ((playerOne == null) || (playerTwo == null)) {
        return Error
    } else {
        return([playerOne, playerTwo])
    }
}

function fillTicTacToeUsers(arr) {
    const users = getPlayers();

    arr[0].img.setAttribute("src", users[0].profilepic);
    arr[1].img.setAttribute("src", users[1].profilepic);

    arr[0].nick.innerHTML = users[0].nick;
    arr[1].nick.innerHTML = users[1].nick;
}