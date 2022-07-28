const saveGame = (matrix, turn, lastmove, gameStillOn, timers, totalMoveList) => {
    const gameState = {
        board: matrix,
        turn: turn,
        lastmove: lastmove,
        gameState: gameStillOn,
        clocks: timers,
        movelist: totalMoveList,
    }
    localStorage.setItem("chessData", JSON.stringify(gameState))
}

const loadGame = (chessData) => {
    matrix = chessData.board;
    player = chessData.turn;
    lastIds = chessData.lastmove;
    gameStillOn = chessData.gameState;
    timers = chessData.clocks;
    totalMoveList = chessData.movelist;

    gameStillOn = true;
    gameMoves = [totalMoveList];
    generateBoard();
}

const checkSaves = () => {
    const availableData = localStorage.getItem("chessData");
    if (availableData != null) {
        loadGame(JSON.stringify(availableData));
        return true;
    } 
}

checkSaves();

export default saveGame;