import globalVariableInstance from "../objects/store/gameGlobalVariables";

var saveGameData = function (phaserGame, value) {
    let currentGameState = phaserGame.state.states.play.cells.children;
    let len = currentGameState.length;
    var tempCells = new Array(9);
    for (let i = 0; i < len; i++) {
        tempCells[i] = currentGameState[i].frame;
    }
    globalVariableInstance.set("boardStatus", {cells: tempCells});
    console.log("Board Status recorded on pause : ", globalVariableInstance.get("boardStatus"));
    let roomData = {
        colorPlayer: globalVariableInstance.get("playerMark"),
        difficulty: 2,
        board: globalVariableInstance.get("boardStatus"),
        playerData: globalVariableInstance.get("playerData"),
        gameOver: value,
        winner: globalVariableInstance.get("win")
    };
    kapow.roomStore.set("game_data", JSON.stringify(roomData), function () {
        console.log("Storing room data was successful.", roomData);
    }, function (error) {
        console.log("Storing room data Failed : ", error);
    });
};
export default saveGameData;