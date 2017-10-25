//TODO : An object that stores all gameVariables necessary to recreate game layout and game status.
var randomRoom = false ;
var gameGlobalVariables = {
  room : null,
  screenState : 0,
  playerData : undefined,
  boardStatus : {cells  : new Array(9)},
  gameResume  : false,
  botLevel  : -1,
  win : 0,
  playerMark : 0 ,
  opponentMark : 0 ,
  gameOver : false,
  gameType : null,
  opponentData : undefined,
  gameLocked : false,
  turnOfPlayer : undefined
};
gameLayoutLoaded = false ;
var saveGameData = function(value) {
  let currentGameState = phaserGame.state.states.play.cells.children;
  let len = currentGameState.length;
  for(let i = 0 ; i < len ; i++) {
    gameGlobalVariables.boardStatus.cells[i]=currentGameState[i].frame ;
  }
  console.log("Board Status recorded on pause : ",gameGlobalVariables.boardStatus);
  let roomData = {
    colorPlayer  : gameGlobalVariables.playerMark,
    difficulty  : 2,
    board :  gameGlobalVariables.boardStatus,
    playerData  : gameGlobalVariables.playerData,
    gameOver  : value,
    winner : gameGlobalVariables.win
  };
  kapow.roomStore.set("game_data", JSON.stringify(roomData), function () {
    console.log("Storing room data was successful.",roomData);
  }, function(error) {
    console.log("Storing room data Failed : ",error);
  });
};

// var shareType = null;
var room = null;
var screenState = 0 ;
var playerData ;
var boardStatus = {cells: new Array(9)};
var gameResume = false ;
var botLevel = -1 ;
var win = 0 ;
var playerMark = 0 ;
var opponentMark = 0 ;
var gameOver = false ;
var gameType = null;
var opponentData;
var gameLocked = false ;
var turnOfPlayer;
function compare(a,b) {
  if(a.data.turnSequenceID < b.data.turnSequenceID) {
    return -1 ;
  }
  else {
    return 1;
  }
}
var parseRoomAndRedirectToGame = function() {
  if (gameGlobalVariables.room == null) {
    console.log("Room is null, hence not redirecting to game");
  }
  else {
    console.log('Parsing Room.');
    var players = gameGlobalVariables.room.players;
    if (players.length >= 1) {
      if (players.length === 2) {
          if (players[0].id === gameGlobalVariables.playerData.id) {
              gameGlobalVariables.opponentData = players[1];
              gameGlobalVariables.playerData = players[0];
          }
          else {
              gameGlobalVariables.opponentData = players[0];
              gameGlobalVariables.playerData = players[1];
          }
          kapow.fetchHistorySince(null,25,
            function(messagesHistory) {
              console.log("History Fetch at CLIENT : ",messagesHistory);
              var history = [];
              var i = 0 ;
              for (var i = messagesHistory.length - 1; i >= 0; i--) {
                if (messagesHistory[i].type === "move" && messagesHistory[i].data.type === "move") {
                  history.push(messagesHistory[i]);
                }
                if ( messagesHistory[i].type === "outcome") {
                  gameGlobalVariables.gameOver = true ;
                  if(messagesHistory[i].data.type === "result") {
                    if(messagesHistory[i].data.ranks[gameGlobalVariables.playerData.id] === messagesHistory[i].data.ranks[gameGlobalVariables.opponentData.id]) {
                      gameGlobalVariables.turnOfPlayer = 0 ;
                    }
                    else if(messagesHistory[i].data.ranks[gameGlobalVariables.playerData.id] === 1) {
                      gameGlobalVariables.turnOfPlayer = gameGlobalVariables.opponentData ;
                    }
                    else if(messagesHistory[i].data.ranks[gameGlobalVariables.playerData.id] === 2) {
                      gameGlobalVariables.turnOfPlayer = gameGlobalVariables.playerData ;
                    }
                    else {
                      console.log("Player Turn couldn't be detrminded");
                    }
                  }
                  else if(messagesHistory[i].data.type === "resignation" || messagesHistory[i].data.type === "timeout") {
                    console.log("Outcome  data :",messagesHistory[i].data.ranks[gameGlobalVariables.playerData.id]);
                    if(messagesHistory[i].data.ranks[gameGlobalVariables.playerData.id] === messagesHistory[i].data.ranks[gameGlobalVariables.opponentData.id]) {
                      gameGlobalVariables.turnOfPlayer = 0 ;
                    }
                    else if(messagesHistory[i].data.ranks[gameGlobalVariables.playerData.id] === 1) {
                      gameGlobalVariables.turnOfPlayer = gameGlobalVariables.opponentData ;
                      console.log("Turn of player set to : ",gameGlobalVariables.opponentData.id);
                    }
                    else if(messagesHistory[i].data.ranks[gameGlobalVariables.playerData.id] === 2) {
                      gameGlobalVariables.turnOfPlayer = gameGlobalVariables.playerData ;
                      console.log("Turn of player set to : ",gameGlobalVariables.playerData.id);
                    }
                    else {
                      console.log("Player Turn couldn't be detrminded");
                    }
                  }
                }
              }
              console.log("Move History sorted according to sequence number",history);
              if(history.length > 0) {
                gameGlobalVariables.boardStatus.cells = history[0].data.moveData.board;
                if(history[0].senderId === gameGlobalVariables.playerData.id) {
                  if(gameGlobalVariables.gameOver === false) {
                    gameGlobalVariables.turnOfPlayer = gameGlobalVariables.opponentData ;
                  }
                }
                else if(history[0].senderId === gameGlobalVariables.opponentData.id) {
                  if(gameGlobalVariables.gameOver === false) {
                    gameGlobalVariables.turnOfPlayer = gameGlobalVariables.playerData ;
                  }
                }
                else {
                  if(gameGlobalVariables.gameOver === false) {
                    console.log("Current Turn can't be determined");
                  }
                }
              }
              else if(gameGlobalVariables.gameOver !== true){
                gameGlobalVariables.turnOfPlayer = undefined ;
              }
            },
            function() {
              console.log('fetchHistory Failed')
            });
      }
      console.log("Redirecting to game...",gameGlobalVariables.opponentData);
      gameGlobalVariables.gameType = 'friend';
      if(gameGlobalVariables.opponentData !== undefined && gameGlobalVariables.opponentData.affiliation === "accepted") {
        phaserGame.state.start('playLoad');
      }
      else if(gameGlobalVariables.opponentData != undefined && (gameGlobalVariables.opponentData.affiliation === "left" || gameGlobalVariables.playerData.affiliation === "left")) {
        gameGlobalVariables.gameOver = true;
        phaserGame.state.start('playLoad');
      }
      else {
        console.log("Invitation not accepted by opponent");
        phaserGame.state.start('waiting');
      }
    }
    else {
      console.log("Room not having player...");
    }
  }
};
var onAffiliationChange = function() {
    kapow.getRoomInfo(function (roomObj) {
        console.log("Client getRoomInfo - Room: " + JSON.stringify(roomObj));
        gameGlobalVariables.room = roomObj;
        gameGlobalVariables.playerMark = 2 ;
        gameGlobalVariables.opponentMark = 1 ;
        parseRoomAndRedirectToGame();
    }, function () {
        console.log("Client - onAffiliationChange failure");
    });
}
var game = {
    onLoad: function(roomObj) {
        //Stats sync
        kapow.gameStore.get('stats',function(statsValue) {
          console.log("onLoad gameStore fetch successfull.");
          if(statsValue) {
            console.log("Value fetched from gameStore was : ",statsValue);
            let valueJSON = JSON.parse(statsValue);
            //TODO : get server view of stats
            //TODO : sync
            // kapow.gameStore.set('stats',function(){
            //   console.log("gameState set successfully");
            //   //TODO : set server side view of table
            // },
            // function(error) {
            //   console.log("gameStore sync failed at load Time");
            // });
          }
          else {
            newStats = {
              "soloStats" : {
                "won"   : 0,
                "lost"  : 0,
                "draw"  : 0 },
               "friendsStats" : {
                 "won"   : 0,
                 "lost"  : 0,
                 "draw"  : 0 },
               "randomStats" : {
                 "won"   : 0,
                 "lost"  : 0,
                 "draw"  : 0 },
             };
            kapow.gameStore.set("stats", JSON.stringify(newStats), function () {
              console.log("Storing following fresh stats data was successful : ",newStats);
            }, function(error) {
              console.log("Storing room data Failed : ",error);
            });
          }
        },
        function(error) {
          console.log("No stats table fetched at loadTable : ",error);
        });
        console.log("Client onLoad - " + JSON.stringify(roomObj));
        gameGlobalVariables.room = roomObj;
        console.log(gameGlobalVariables.room);
        kapow.getUserInfo(function (userObj) {
                console.log("Client getUserInfoSuccess - User: " + JSON.stringify(userObj));
                user = userObj.player;
                gameGlobalVariables.playerData = user;
                if(gameGlobalVariables.room !== null) { //Game already created sometime earlier
                  gameGlobalVariables.gameResume = true;
                  if(gameGlobalVariables.room.players.length > 1) {
                    gameGlobalVariables.gameType = "friend";
                  }
                  else if(gameGlobalVariables.room.lockStatus === "locked"){
                    gameGlobalVariables.gameType = "solo";
                    kapow.roomStore.get('game_data',function(value) {
                      if(value) {
                        let valueJSON = JSON.parse(value);
                        console.log(valueJSON);
                        gameGlobalVariables.playerMark = valueJSON.colorPlayer;
                        gameGlobalVariables.botLevel  = valueJSON.difficulty;
                        gameGlobalVariables.boardStatus =  valueJSON.board;
                        gameGlobalVariables.playerData  = valueJSON.playerData;
                        gameGlobalVariables.gameOver = valueJSON.gameOver;
                        gameGlobalVariables.gameLocked = gameGlobalVariables.gameOver;
                        gameGlobalVariables.win = valueJSON.winner;
                      }
                      else {
                        console.log('Game Variables Not set');
                      }
                    }, function(error) {
                      console.log("Nothing Found : ",error);
                    });
                  }
                  else {
                    gameGlobalVariables.gameType = "friend";
                  }
                }
                else {
                  gameGlobalVariables.gameResume = false ;
                }
                console.log("room : ",gameGlobalVariables.room);
                phaserGame.state.start('boot');
            }, function () {
            console.log("Client getUserInfo failure");
        });

    },
    onGameEnd : function(outcome) {
      console.log("CLIENT : Game Ended",outcome);
      if(outcome.type === "resignation" || outcome.type === "timeout"){
        if(outcome.ranks[gameGlobalVariables.playerData.id] === 1) {
          console.log("Game Won");
          gameEndHandler(2);
        }
        else {
          console.log("Game Lost");
          gameEndHandler(1);
        }
      }
      if(outcome.ranks[gameGlobalVariables.playerData.id] === 1 && outcome.ranks[gameGlobalVariables.opponentData.id] === 1) {
        console.log("Game Draw");
      }
      else if(outcome.ranks[gameGlobalVariables.playerData.id] === 1) {
        console.log("Game Won");
      }
      else {
        console.log("Game Lost");
      }
    },
    onPlayerJoined: function(playerObj) {
      console.log("CLIENT onPlayerJoined - " + JSON.stringify(gameGlobalVariables.playerData));
      //onAffiliationChange();
    },
    onInviteRejected: function(playerObj) {
        console.log("Client onInviteRejected - " + JSON.stringify(gameGlobalVariables.playerData));
        onAffiliationChange();
    },
    onPlayerLeft: function(playerObj) {
        console.log("Client onPlayerLeft - " + JSON.stringify(gameGlobalVariables.playerData));
    },
    onTurnChange : function(playerObj) {
      console.log("Player Turn Changed to : " + JSON.stringify(playerObj));
      if(playerObj.id === gameGlobalVariables.playerData.id) {
        gameGlobalVariables.turnOfPlayer = playerObj ;
      }
      else {
        gameGlobalVariables.turnOfPlayer = undefined ;
      }
    },
    onPause: function() {
      console.log('On Pause Triggered.');
    },
    onResume:function() {
      if(gameGlobalVariables.screenState === 1 && gameGlobalVariables.gameType === "friend") {
        gameGlobalVariables.gameResume = true;
        parseRoomAndRedirectToGame();
      }
      console.log('On Resume Triggered.');
    },
    onMessageReceived : function (message) {
      console.log('CLIENT : Message Received - ',message);
      if(gameLayoutLoaded === true && message.type === "move" && message.senderId === gameGlobalVariables.opponentData.id) {
        for(var i = 0 ; i < 9 ; i++) {
          phaserGame.state.states.play.cells.children[i].frame = message.data.moveData.board[i];
        }
        gameLayoutVariables.opponentProfilePic.alpha = 0.3;
        gameLayoutVariables.playerProfilePic.alpha = 1;
        gameLayoutVariables.turnText.text = "YOUR TURN";
        gameGlobalVariables.boardStatus.cells = message.data.moveData.board;
        if(gameGlobalVariables.playerMark === 0) {
          gameGlobalVariables.playerMark = 2;
        }
        if(message.data.result === "lost") {
          console.log("Lost");
          drawWinningLine();
          gameEndHandler(1);
        }
        else if(message.data.result === "draw") {
          console.log("Draw");
          gameEndHandler(0);
        }
      }
      else if(gameLayoutLoaded === false && message.type === "move" && message.data.type === "markSet") {
        onAffiliationChange();
      }
    },
    onBackButtonPressed:  function() {
      console.log('BackButton Triggered.');
      if(gameGlobalVariables.screenState === 1) {
        kapow.unloadRoom(function() {
          console.log('Room Succesfully Unloaded');
        },function() {
          console.log('Room Unloading Failed');
        });
        gameGlobalVariables.gameResume = false;
        gameGlobalVariables.room=null;
        gameGlobalVariables.playerMark = 0;
        gameGlobalVariables.gameType = null;
        gameGlobalVariables.botLevel  = -1;
        gameGlobalVariables.boardStatus =  {cells: new Array(9)};
        gameGlobalVariables.opponentData = undefined;
        gameGlobalVariables.turnOfPlayer = undefined;
        gameGlobalVariables.gameOver = false;
        gameGlobalVariables.win = 0;
        phaserGame.state.start('menu');
      }
      else {
        kapow.close();
      }
      return true;
    },
    onRoomLockStatusChange:  function(roomObj) {
      console.log("Room Lock status changed.");
    }
  }
