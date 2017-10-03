var mysql = require('mysql');
var getToken = function() {
    return "23lu3u3z52liil2zz7i829il2zz53uul";
};
var game = {
    onMessageDelivered: function (data) {
        console.log("SERVER onMessageDelivered - " + JSON.stringify(data));
    },
    onPlayerJoined: function(playerObj) {
      console.log("SERVER onPlayerJoined - " + JSON.stringify(playerObj));
      var room = kapow.getRoomInfo();
      // Devise a method to recognize gametype.
      kapow.setNextPlayer(playerObj.id, room.roomId, function() {
        console.log("SERVER setNextPlayer success.");
      }, function() {
        console.log("SERVER setNextPlayer FAILED.");
      });
      var sql = mysql.createConnection({
        host: process.env.RDS_ENDPOINT,
        user: 'ttt',
        password: getToken(),
        database: 'ttt'
      });
      sql.connect();
      console.log("INSERT INTO playerRoomMark (roomID, playerID) VALUES (\""+room.roomId+"\" , \""+playerObj.id+"\");");
      sql.query("INSERT INTO playerRoomMark (roomID, playerID) VALUES (\""+room.roomId+"\" , \""+playerObj.id+"\");");
      sql.end();
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
                  kapow.boards.postScores( {
                    'playerId' : move.playerTurn,
                    'scores' : {
                      'points' : 5
                    }
                  },
                  function() {
                    kapow.return(data);
                  },
                  function(error) {
                    console.log("Error in posting scores",error);
                    kapow.return(null,error);
                  });
                },
                function (error) {
                  console.log("Game End Broadcast - failure",error);
                  kapow.return(null,error);
                });
            }
            else {
              kapow.return(data);
            }
        },
        function (error) {
            console.log("sendTurn - failure");
            kapow.return(null,error);
        }
      );
    },
    playerMark: function(playerObj) {
      var room = kapow.getRoomInfo();
      var sql = mysql.createConnection({
        host: process.env.RDS_ENDPOINT,
        user: 'ttt',
        password: getToken(),
        database: 'ttt'
      });
      sql.connect();
      console.log("SELECT * FROM playerRoomMark where roomID = \""+room.roomId+"\";");
      sql.query("SELECT * FROM playerRoomMark where roomID = \""+room.roomId+"\";",
        function (error, results, fields) {
            if(results[0].playerID === playerObj.id) {
            // if nothing has changed terminate the game
                kapow.return(1);
            }
            else {
                kapow.return(2);
            }
        });
      sql.end();
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
          kapow.boards.postScores( {
            'playerId' : move.playerTurn,
            'scores' : {
              'points' : 5
            }
          },
          function() {
            kapow.return(move);
          },
          function(error) {
            console.log("Error in posting scores",error);
            kapow.return(null,error);
          });
        },
        function (error) {
          console.log("Game End Broadcast - failure",error);
          kapow.return(null, error);
      });
    },
    onPlayerLeft: function(playerObj) {
      var room = kapow.getRoomInfo();
      console.log("SERVER : onPlayer left called by "+JSON.stringify(playerObj)+" in room : "+JSON.stringify(room));
      var outcome = {} ;
      outcome["ranks"] = {}
      outcome["type"]="resignation";
      if(room.players[0] === playerObj.id) {
        outcome["ranks"][room.players[0]] = 2;
        outcome["ranks"][room.players[1]] = 1;
      }
      else {
        outcome["ranks"][room.players[0]] = 1;
        outcome["ranks"][room.players[1]] = 2;
      }
      kapow.game.end(outcome,
        room.roomId,
        function () {
          console.log("Game End Broadcast - success");
        },
        function (error) {
          console.log("Game End Broadcast - failure",error);
          kapow.return(null, error);
      });
    }
};
