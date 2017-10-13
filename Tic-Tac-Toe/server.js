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
        var sql = mysql.createConnection({
          host: process.env.RDS_ENDPOINT,
          user: 'ttt',
          password: getToken(),
          database: 'ttt'
        });
        timeNow = Math.floor(Date.now()/1000);
        sql.connect();
        console.log("INSERT INTO playerRoomMark (roomID, playerID) VALUES (\""+room.roomId+"\" , \""+playerObj.id+"\");");
        sql.query("INSERT INTO playerRoomMark (roomID, playerID) VALUES (\""+room.roomId+"\" , \""+playerObj.id+"\");",
          function(error,results,fields) {
            kapow.game.sendData({type:"markSet"},playerObj.id,room.roomId,function() {
              console.log("SERVER : sending markSet trigger successful");
            },function(){
              console.log("SERVER : sending markSet trigger failure");
            });
          });
        console.log("INSERT INTO gameStatus (roomID, playerID, board) VALUES (\""+room.roomId+"\" , \""+playerObj.id+"\" , \""+"000000000"+"\");");
        sql.query("INSERT INTO gameStatus (roomID, playerID, board) VALUES (\""+room.roomId+"\" , \""+playerObj.id+"\" , \""+"000000000"+"\");");
        console.log("INSERT INTO timeoutRecord (roomID, playerID, timeStamp) VALUES (\""+room.roomId+"\" , \""+playerObj.id+"\" , \""+timeNow+"\");");
        sql.query("INSERT INTO timeoutRecord (roomID, playerID, timeStamp) VALUES (\""+room.roomId+"\" , \""+playerObj.id+"\" , \""+timeNow+"\");");
        sql.end();
      }, function() {
        console.log("SERVER setNextPlayer FAILED.");
      });
    },
    makeMove: function (move) {
      console.log("SERVER : move recieved in makeMove() : ",JSON.stringify(move));
      var gameResult;
      var dataArray = move.board;
      var moveString = "";
      for(var j = 0 ; j < 9 ; j++) {
        if(dataArray[j] === null) {
          moveString+="0";
        }
        else {
          moveString+=dataArray[j]===1 ? "1" : "2" ;
        }
      }
      var sql = mysql.createConnection({
        host: process.env.RDS_ENDPOINT,
        user: 'ttt',
        password: getToken(),
        database: 'ttt'
      });
      sql.connect();
      sql.query("SELECT * FROM gameStatus WHERE roomID = \""+move.roomID+"\" AND playerID = \""+move.playerTurn+"\";",
          function (error, results, fields) {
              if(results.length === 1) {
                var flag = 0 ;
                var boardString = "" ;
                console.log("results.board",results[0].board);
                console.log("moveString",moveString);
                for(var i = 0 ; i < 9 ; i++) {
                  boardString = boardString + moveString[i];
                  if(results[0].board[i] !== moveString[i] && flag !== 0) {
                    flag = 2 ;
                    console.log("Invalid Move");
                  }
                  else if (results[0].board[i] !== moveString[i] && results[0].board[i] === '0') {
                    flag = 1 ;
                  }
                }
                if(flag === 1) {
                  //Move Identified
                  console.log("SERVER : move received : ",dataArray);
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
                    type  : "move",
                    moveData : move,
                    result : gameResult,
                  };
                  kapow.game.sendTurn(data,move.roomID,move.playerTurn,move.opponentTurn, null,
                    function () {
                        console.log("sendTurn - success");
                        //save game state in DB
                        var sanitysql = mysql.createConnection({
                          host: process.env.RDS_ENDPOINT,
                          user: 'ttt',
                          password: getToken(),
                          database: 'ttt'
                        });
                        sanitysql.connect();
                        var timeNow = Math.floor(Date.now()/1000);
                        console.log("UPDATE gameStatus SET playerID =\""+move.opponentTurn+"\", board =  \""+boardString+"\" WHERE roomID = \""+move.roomID+"\";");
                        sanitysql.query("UPDATE gameStatus SET playerID =\""+move.opponentTurn+"\", board =  \""+boardString+"\" WHERE roomID = \""+move.roomID+"\";");
                        console.log("UPDATE timeoutRecord SET playerID =\""+move.opponentTurn+"\" , timeStamp = \""+timeNow+"\" WHERE roomID = \""+move.roomID+"\";");
                        sanitysql.query("UPDATE timeoutRecord SET playerID =\""+move.opponentTurn+"\" , timeStamp = \""+timeNow+"\" WHERE roomID = \""+move.roomID+"\";");
                        sanitysql.end();
                        //TODO : scheduleRPC
                        console.log("GameResult  : ",gameResult);
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
                              if(gameResult === 'lost') {
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
                              }
                              else {
                                kapow.return(data);
                              }
                            },
                            function (error) {
                              console.log("Game End Broadcast - failure",error);
                              kapow.return(null,error);
                            });
                        }
                        else {
                            kapow.rpc.schedule("timeout",
                              {
                                "playerID" :  move.opponentTurn,
                                "winnerID" :  move.playerTurn,
                                "boardStatus" : boardString,
                                "roomID"  :move.roomID
                              }, 1,
                              function(){
                                console.log("SERVER : scheduleRpc successfull");
                                kapow.return(data);
                              },
                              function(error) {
                                console.log("SERVER : scheduleRpc failed");
                                kapow.return(null,error);
                              }
                            );
                        }
                    },
                    function (error) {
                        console.log("sendTurn - failure");
                        kapow.return(null,error);
                    }
                  );
                }
                else if(flag === 2) {
                  //Multiple Move Registered
                  kapow.return(null,{"error" : "Multiple Move Received"});
                }
                else {
                  //Invalid Move Handler
                  kapow.return(null,{"error" : "No Move Received"});
                }
              }
              else if(results.length === 0) {
                console.log("SERVER : Game Status record for the playerID and roomID combination not Found");
                kapow.return(null,{"error" : "Game Status record for the playerID and roomID combination not Found"});
              }
              else {
                console.log("SERVER : Game Status record for the playerID and roomID combination was more than 1");
                kapow.return(null,{"error" : "SERVER : Game Status record for the playerID and roomID combination was more than 1"});
              }
      });
      sql.end();
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
    },
    timeout : function(parameter) {
      console.log("SERVER : Timeout Triggered");
      var sql = mysql.createConnection({
        host: process.env.RDS_ENDPOINT,
        user: 'ttt',
        password: getToken(),
        database: 'ttt'
      });
      sql.connect();
      sql.query("SELECT * FROM timeoutRecord WHERE roomID = \""+parameter.roomID+"\" AND playerID = \""+parameter.playerID+"\";",
        function (error, results, fields) {
          console.log("SERVER : Results fetched at \"timeout\"",results);
          console.log("SERVER : \"parameter\" received at \"timeout\"",parameter);
          if(results.length === 1) {
            timeNow = Math.floor(Date.now()/1000);
            console.log("timeOut query done at "+timeNow+" "+(timeNow-results[0].timeStamp));
            if(results[0].playerID === parameter.playerID && Number(timeNow - results[0].timeStamp)>60) {
              var outcome = {} ;
              outcome["ranks"] = {}
              outcome["type"]="timeout";
              outcome["ranks"][parameter.playerID] = 2;
              outcome["ranks"][parameter.winnerID] = 1;
              //TODO :  Outcome of type timeout to be updated in client
              kapow.game.end(outcome,
                parameter.roomID,
                function () {
                  console.log("Game End Broadcast - success");
                },
                function (error) {
                  console.log("Game End Broadcast - failure",error);
                  kapow.return(null, error);
              });
            }
          }
          else if(results.length === 0) {
            console.log("SERVER : No timeOUT record Found");
          }
          else {
            console.log("SERVER : MoreThan 1 timeOUT record Found");
          }
        }
      );
      sql.end();
    }
};
