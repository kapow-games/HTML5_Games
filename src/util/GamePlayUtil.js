'use strict';

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
    }
};
export default GamePlayUtil;