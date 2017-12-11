'use strict';

import gameInfo from "../objects/store/GameInfo";
import parseRoomAndRedirectToGame from "./roomRedirect";

let GamePlayUtil = {
    getWinningPosition: function(gameLayout){
        let winningPosition = null;
        if (gameLayout[0] && gameLayout[0] === gameLayout[1] && gameLayout[0] === gameLayout[2]) {
            winningPosition = {
                x : 222,
                y : 948,
                key : 'rectangle',
                anchor : 0.5,
                angle : 0
            };
        }
        else if (gameLayout[3] && gameLayout[3] === gameLayout[4] && gameLayout[3] === gameLayout[5]) {
            winningPosition = {
                x : 552,
                y : 948,
                key : 'rectangle',
                anchor : 0.5,
                angle : 0
            };
        }
        else if (gameLayout[6] && gameLayout[6] === gameLayout[7] && gameLayout[6] === gameLayout[8]) {
            winningPosition = {
                x : 882,
                y : 948,
                key : 'rectangle',
                anchor : 0.5,
                angle : 0
            };
        }
        else if (gameLayout[0] && gameLayout[0] === gameLayout[3] && gameLayout[0] === gameLayout[6]) {
            winningPosition = {
                x : 552,
                y : 633,
                key : 'rectangle',
                anchor : 0.5,
                angle : 90
            };
        }
        else if (gameLayout[1] && gameLayout[1] === gameLayout[4] && gameLayout[1] === gameLayout[7]) {
            winningPosition = {
                x : 552,
                y : 948,
                key : 'rectangle',
                anchor : 0.5,
                angle : 90
            };
        }
        else if (gameLayout[2] && gameLayout[2] === gameLayout[5] && gameLayout[2] === gameLayout[8]) {
            winningPosition = {
                x : 552,
                y : 1263,
                key : 'rectangle',
                anchor : 0.5,
                angle : 90
            };
        }
        else if (gameLayout[0] && gameLayout[0] === gameLayout[4] && gameLayout[0] === gameLayout[8]) { // Diagonal
            winningPosition = {
                x : 552,
                y : 948,
                key : 'rectangle',
                anchor : 0.5,
                angle : -45
            };
        }
        else if (gameLayout[2] !== null && gameLayout[2] !== undefined && gameLayout[2] === gameLayout[4] && gameLayout[2] === gameLayout[6]) {
            winningPosition = {
                x : 552,
                y : 948,
                key : 'rectangle',
                anchor : 0.5,
                angle : 45
            };
        }
        else {
            console.log("Client doesn't confirm result.");
        }
        return winningPosition;
    },
    saveGameData :function(state, value){
        let len = state.length, tempCells = [];
        for (let i = 0; i < len; i++) {
            tempCells.push(state[i].frame);
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
    },
    parseRoomAndRedirectToGame: function(){
        parseRoomAndRedirectToGame();
    }

};
export default GamePlayUtil;