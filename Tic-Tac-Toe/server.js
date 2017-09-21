
var game = {
    onMessageDelivered: function (data) {
        console.log("SERVER onMessageDelivered - " + JSON.stringify(data));
    },
    onPlayerJoined: function(playerObj) {
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
            if (gameResult !== "unknown") {
              var outcome = {};
              outcome["ranks"] = {}
              if (gameResult === "draw") {
                  outcome["ranks"][move.playerTurn] = 1;
                  outcome["ranks"][move.opponentTurn] = 1;
              } else if (gameResult === "lost") {
                  outcome["ranks"][move.opponentTurn] = 2;
                  outcome["ranks"][move.playerTurn] = 1;
              }
              outcome["type"]="result";
              console.log("SERVER Game End Broadcast data",outcome);
              kapow.game.end(outcome,
                move.roomID,
                function () {
                  console.log("Game End Broadcast - success");
                  kapow.return(data);
                },
                function (error) {
                  console.log("Game End Broadcast - failure",error);
                  kapow.return(null,error);
                });
            }
        },
        function () {
            console.log("sendTurn - failure");
            kapow.return(null,error);
        }
      );
    },
    resignationRequest: function (move) {
      console.log("SERVER : resignation request recieved in resignationRequest() : ",JSON.stringify(move));
      var gameResult;
      var outcome = {};
      outcome["ranks"] = {}
      outcome["ranks"][move.opponentTurn] = 1;
      outcome["ranks"][move.playerTurn] = 2;
      outcome["type"]="resignation";
      kapow.game.end(outcome,
        move.roomID,
        function () {
          console.log("Game End Broadcast - success");
          kapow.return(move);
        },
        function (error) {
          console.log("Game End Broadcast - failure",error);
          kapow.return(null, error);
      });
    }

};
