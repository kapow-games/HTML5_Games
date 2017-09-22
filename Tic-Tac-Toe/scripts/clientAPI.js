//TODO : An object that stores all gameVariables necessary to recreate game layout and game status.
var gameVariables = {
  room : null,
  screenState : 0,
  playerData : null,
  boardStatus : {cells  : new Array(9)},
  gameResume  : false,
  botLevel  : 1,
  win : 0,
  gameModeFriend  : null, //0 : vsSolo, 1 : vsRandom, 2 :vsFriend
  playerMark : 0
};
gameLayoutLoaded = false ;
var saveGameData = function(value) {
  let currentGameState = phaserGame.state.states.play.cells.children;
  let len = currentGameState.length;
  for(let i = 0 ; i < len ; i++) {
    // boardStatus = boar
    boardStatus.cells[i]=currentGameState[i].frame ;
  }
  console.log("Board Status recorded on pause : ",boardStatus);
  let roomData = {
    colorPlayer  : playerMark,
    difficulty  : 2,
    board :  boardStatus,
    playerData  : playerData,
    gameOver  : value,
    winner : win
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
  if (room == null) {
    console.log("Room is null, hence not redirecting to game");
  }
  else {
    console.log('Parsing Room.');
    var players = room.players;
    if (players.length >= 1) {
        if (players.length === 2) {
            if (players[0].id === playerData.id) {
                opponentData = players[1];
                playerData = players[0];
            }
            else {
                opponentData = players[0];
                playerData = players[1];
            }
            kapow.fetchHistorySince(null,20,
              function(messagesHistory) {
                console.log("History Fetch at CLIENT : ",messagesHistory);
                var history = [];
                if(messagesHistory.length === 0) {
                  //This is the player who has invited for invite friend.
                  playerMark = 1 ;
                }
                else {
                  if(messagesHistory[0].type === "affiliation_change" || messagesHistory[0].type === "room_lock_status") {
                    console.log("First Message in was "+messagesHistory[0].type+" indicator.");
                    if(messagesHistory[0].type === "room_lock_status") {
                      if(messagesHistory.length === 1) {
                        playerMark = 1 ;
                        opponentMark = 2 ;
                        console.log("You are Marked 'X'");
                      }
                      else if(messagesHistory[1].data.actorJid === playerData.id) {
                        playerMark = 1 ;
                        opponentMark = 2 ;
                        console.log("You are Marked 'X'");
                      }
                      else {
                        playerMark = 2 ;
                        opponentMark = 1 ;
                        console.log("You are Marked 'O'");
                      }
                    }
                    else {
                      if(messagesHistory[0].data.actorJid === playerData.id) {
                          playerMark = 2 ;
                          opponentMark = 1 ;
                          console.log("You are Marked 'O'");
                      }
                      else if(messagesHistory[0].data.actorJid === opponentData.id) {
                        playerMark = 1 ;
                        opponentMark = 2 ;
                        console.log("You are Marked 'X'");
                      }
                    }
                  }
                  else {
                    console.log("First Message in was NOT affiliation change indicator", messagesHistory[0]);
                  }
                  for (var i = messagesHistory.length - 1; i >= 0; i--) {
                    if (messagesHistory[i].type == "move") {
                      history.push(messagesHistory[i]);
                    }
                    if ( messagesHistory[i].type === "outcome") {
                      gameOver = true ;
                      if(messagesHistory[i].data.type === "result") {
                        if(messagesHistory[i].data.ranks[playerData.id] === messagesHistory[i].data.ranks[opponentData.id]) {
                            turnOfPlayer = 0 ;
                        }
                        else if(messagesHistory[i].data.ranks[playerData.id] === 1) {
                          turnOfPlayer = opponentData ;
                        }
                        else if(messagesHistory[i].data.ranks[playerData.id] === 2) {
                          turnOfPlayer = playerData ;
                        }
                        else {
                          console.log("Player Turn couldn't be detrminded");
                        }
                      }
                      else if(messagesHistory[i].data.type === "resignation") {
                        if(messagesHistory[i].data.ranks[playerData.id] === messagesHistory[i].data.ranks[opponentData.id]) {
                            turnOfPlayer = 0 ;
                        }
                        else if(messagesHistory[i].data.ranks[playerData.id] === 1) {
                          turnOfPlayer = opponentData ;
                        }
                        else if(messagesHistory[i].data.ranks[playerData.id] === 2) {
                          turnOfPlayer = playerData ;
                        }
                        else {
                          console.log("Player Turn couldn't be detrminded");
                        }
                      }
                    }
                  }
                }
                console.log("Move History sorted according to sequence number",history);
                if(history.length > 0) {
                  boardStatus.cells = history[0].data.moveData.board;
                  if(history[0].senderId === playerData.id) {
                    if(gameOver === false) {
                      turnOfPlayer = opponentData ;
                    }
                  }
                  else if(history[0].senderId === opponentData.id) {
                    if(gameOver === false) {
                      turnOfPlayer = playerData ;
                    }
                  }
                  else {
                    if(gameOver === false) {
                      console.log("Current Turn can't be determined");
                    }
                  }
                }
                else {
                  if(playerMark === 2) {
                    if(gameOver === false) {
                      turnOfPlayer = opponentData ;
                    }
                  }
                  else if(playerMark === 1){
                    if(gameOver === false) {
                      turnOfPlayer = playerData ;
                    }
                  }
                  else {
                    if(gameOver === false) {
                      console.log("Current Turn can't be determined");
                    }
                  }
                }
              },
              function() {
                console.log('fetchHistory Failed')
              });
        }
        if (players.length === 1) {
          //Random opponent not found yet.
          if (players[0].id === playerData.id) {
              playerData = players[0];
              playerMark = 2 ;
          } else {
              opponentData = players[0];
          }
        }
        console.log("Redirecting to game...",opponentData);
        gameType = 'friend';
        if(opponentData !== undefined && opponentData.affiliation === "accepted") {
          phaserGame.state.start('play');
        }
        else if(opponentData != undefined && (opponentData.affiliation === "left" || playerData.affiliation === "left")) {
          gameOver = true;
          phaserGame.state.start('play');
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
        room = roomObj;
        parseRoomAndRedirectToGame();
    }, function () {
        console.log("Client - onAffiliationChange failure");
    });
}
var game = {
    onLoad: function(roomObj) {
        console.log("Client onLoad - " + JSON.stringify(roomObj));
        room = roomObj;
        console.log(room);
        kapow.getUserInfo(function (userObj) {
                console.log("Client getUserInfoSuccess - User: " + JSON.stringify(userObj));
                user = userObj.player;
                playerData = user;
                if(room !== null) { //Game already created sometime earlier
                  gameResume = true;
                  if(room.players.length > 1) {
                    gameType = "friend";
                  }
                  else if(room.lockStatus === "locked"){
                    gameType = "solo";
                    kapow.roomStore.get('game_data',function(value) {
                      if(value) {
                        let valueJSON = JSON.parse(value);
                        console.log(valueJSON);
                        playerMark = valueJSON.colorPlayer;
                        botLevel  = valueJSON.difficulty;
                        boardStatus =  valueJSON.board;
                        playerData  = valueJSON.playerData;
                        gameOver = valueJSON.gameOver;
                        gameLocked = gameOver;
                        win = valueJSON.winner;
                      }
                      else {
                        console.log('Game Variables Not set');
                      }
                    }, function(error) {
                      console.log("Nothing Found : ",error);
                    });
                  }
                  else {
                    gameType = "friend";
                  }
                }
                else {
                  gameResume = false ;
                }
                console.log("room : ",room);
                phaserGame.state.start('boot');
            }, function () {
            console.log("Client getUserInfo failure");
        });

    },
    onGameEnd : function(outcome) {
      console.log("CLIENT : Game Ended",outcome);
      if(outcome.type === "resignation"){
        if(outcome.ranks[playerData.id] === 1) {
          console.log("Game Won");
          gameEndHandler(2);
        }
        else {
          console.log("Game Lost");
          gameEndHandler(1);
        }
      }
      if(outcome.ranks[playerData.id] === 1 && outcome.ranks[opponentData.id] === 1) {
        console.log("Game Draw");
      }
      else if(outcome.ranks[playerData.id] === 1) {
        console.log("Game Won");
      }
      else {
        console.log("Game Lost");
      }
    },
    onPlayerJoined: function(playerObj) {
      console.log("CLIENT onPlayerJoined - " + JSON.stringify(playerData));
      onAffiliationChange();
    },
    onInviteRejected: function(playerObj) {
        console.log("Client onInviteRejected - " + JSON.stringify(playerData));
        onAffiliationChange();
    },
    onPlayerLeft: function(playerObj) {
        console.log("Client onPlayerLeft - " + JSON.stringify(playerData));
    },
    onTurnChange : function(playerObj) {
      console.log("Player Turn Changed to : " + JSON.stringify(playerObj));
      if(playerObj.id === playerData.id) {
        turnOfPlayer = playerObj ;
      }
      else {
        turnOfPlayer = undefined ;
      }
    },
    onPause: function() {
      console.log('On Pause Triggered.');
    },
    onResume:function() {
      console.log('On Resume Triggered.');
    },
    onMessageReceived : function (message) {
      console.log('CLIENT : Message Received - ',message);
      if(gameLayoutLoaded === true && message.type === "move" && message.senderId === opponentData.id) {
        for(var i = 0 ; i < 9 ; i++) {
          phaserGame.state.states.play.cells.children[i].frame = message.data.moveData.board[i];
        }
        gameLayoutVariables.opponentProfilePic.alpha = 0.3;
        gameLayoutVariables.playerProfilePic.alpha = 1;
        gameLayoutVariables.turnText.text = "Your Turn.";
        boardStatus.cells = message.data.moveData.board;
        if(playerMark === 0) {
          playerMark = 2;
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
    },
    onBackButtonPressed:  function() {
      console.log('BackButton Triggered.');
      if(screenState === 1) {
        kapow.unloadRoom(function(){console.log('Room Succesfully Unloaded');},function(){console.log('Room Unloading Failed');});
        gameResume = false;
        room=null;
        playerMark = 0;
        gameType = null;
        botLevel  = -1;
        boardStatus =  {cells: new Array(9)};
        opponentData = undefined;
        turnOfPlayer = undefined;
        gameOver = false;
        win = 0;
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
