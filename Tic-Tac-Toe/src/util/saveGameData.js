import gameInfo from "../objects/store/GameInfoStore";

var saveGameData = function (phaserGame, value) {
    let currentGameState = phaserGame.state.states.Play.cells.children;
    let len = currentGameState.length;
    let tempCells = [];
    for (let i = 0; i < len; i++) {
        tempCells.push(currentGameState[i].frame);
    }
    gameInfo.set("boardStatus", {cells: tempCells});
    console.log("Board Status recorded on pause : ", gameInfo.get("boardStatus"));
    let roomData = {
        colorPlayer: gameInfo.get("playerMark"),
        difficulty: 2,
        board: gameInfo.get("boardStatus"),
        playerData: gameInfo.get("playerData"),
        gameOver: value,
        winner: gameInfo.get("win")
    };
    kapow.roomStore.set("game_data", JSON.stringify(roomData), function () {
        console.log("Storing room data was successful.", roomData);
    }, function (error) {
        console.log("Storing room data Failed : ", error);
    });
};
export default saveGameData;