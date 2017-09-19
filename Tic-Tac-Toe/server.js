
var game = {
    onMessageDelivered: function (data) {
        console.log("SERVER onDataDelivered - " + JSON.stringify(data));
    },
    // getInitialData:  function (room) {
    //     console.log("getInitialData called with param 2 : " + JSON.stringify(room));
    //     var players = room.players;
    //     var player1 = players[0].id;
    //     var player2 = players[1].id;
    //
    //     var playerTurn;
    //     var playerNonTurn;
    //     if (player1.localeCompare(player2) >= 0) {
    //         playerTurn = player1;
    //         playerNonTurn = player2;
    //     } else {
    //         playerTurn = player2;
    //         playerNonTurn = player1;
    //     }
    //     var data = {
    //         "sequence" : 0,
    //         "playerSymbol" : {
    //             "X" : playerTurn,
    //             "O" : playerNonTurn
    //         },
    //         "playerTurn" : playerTurn
    //     };
    //
    //     kapow.sendData(data,
    //         room.senderId,
    //         room.roomId,
    //         function () {
    //             console.log("sendData - success");
    //         },
    //         function () {
    //             console.log("sendData - failure");
    //         }
    //     );
    //
    //     console.log("Calling setNextPlayer from getInitialData with player: " + playerTurn + ", room: " + room.roomId);
    //     kapow.setNextPlayer(playerTurn,
    //         room.roomId,
    //         function () {
    //             console.log("setNextPlayer - success");
    //         },
    //         function () {
    //             console.log("setNextPlayer - failure");
    //         }
    //     );
    //
    //     kapow.return(data);
    // },
    onPlayerJoined: function(playerObj) {
      // data = {
      //   board : new Array(9);
      //   mark = 1 ;
      // };
      // kapow.sendTurn(data, roomID, playerObj.);
      console.log("SERVER onPlayerJoined - " + JSON.stringify(playerObj));
    },
    makeMove: function (move) {
      console.log("SERVER : move recieved in makeMove() : ",JSON.stringify(move));
      var gameResult;
      var dataArray = move.board;
      console.log(dataArray);
      if ((dataArray[0] !== null && dataArray[0] === dataArray[1] && dataArray[0] === dataArray[2]) || // COL 0
          (dataArray[3] !== null && dataArray[3] === dataArray[4] && dataArray[3] === dataArray[5]) ||
          (dataArray[6] !== null && dataArray[6] === dataArray[7] && dataArray[6] === dataArray[8]) ||
          (dataArray[0] !== null && dataArray[0] === dataArray[3] && dataArray[0] === dataArray[6]) || // ROW 0
          (dataArray[1] !== null && dataArray[1] === dataArray[4] && dataArray[1] === dataArray[7]) ||
          (dataArray[2] !== null && dataArray[2] === dataArray[5] && dataArray[2] === dataArray[8]) ||
          (dataArray[0] !== null && dataArray[0] === dataArray[4] && dataArray[0] === dataArray[8]) || // Diagonal
          (dataArray[2] !== null && dataArray[2] === dataArray[4] && dataArray[2] === dataArray[6])) {
          gameResult = "lost";
      }
      else if (dataArray[0] != null && dataArray[1] != null && dataArray[2] != null &&
        dataArray[3] != null && dataArray[4] != null && dataArray[5] != null &&
        dataArray[6] != null && dataArray[7] != null && dataArray[8] != null) {
        gameResult = "draw";
      }
      else {
        gameResult = "unknown";
      }
      var data = {
        moveData : move,
        result : gameResult,
      };
      // console.log(JSON.stringify(kapow));
      kapow.game.sendTurn(data,move.roomID,move.playerTurn,move.opponentTurn, null,
        function () {
            console.log("sendTurn - success");
        },
        function () {
            console.log("sendTurn - failure");
        }
      );
      if (gameResult !== "unknown") {
        var outcome = {};
        outcome["ranks"] = {}
        if (gameResult === "draw") {
            outcome["ranks"][move.playerTurn] = 1;
            outcome["ranks"][move.opponentTurn] = 1;
        } else if (gameResult === "lost") {
            outcome["ranks"][move.opponentTurn] = 1;
            outcome["ranks"][move.playerTurn] = 2;
        }
        outcome["type"]="result";
        // outcome["data"]={};
        // outcome["data"]["extraData"] = move.board;
        console.log("SERVER Game End Broadcast data",outcome);
        kapow.game.end(outcome,
          move.roomID,
          function () {
            console.log("Game End Broadcast - success");
          },
          function (error) {
            console.log("Game End Broadcast - failure",error);
          });
      }
      kapow.return(data);
    }

};
