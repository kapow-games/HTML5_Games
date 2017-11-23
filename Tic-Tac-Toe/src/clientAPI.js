//TODO : An object that stores all gameVariables necessary to recreate game layout and game status.
var randomRoom = false ;
var globalVariableInstance = new gameGlobalVariables();
//var globalVariableInstance = {
//  room : null,
//  screenState : 0,
//  playerData : undefined,
//  boardStatus : {cells  : new Array(9)},
//  gameResume  : false,
//  botLevel  : -1,
//  win : 0,
//  playerMark : 0 ,
//  opponentMark : 0 ,
//  gameOver : false,
//  gameType : null,
//  opponentData : undefined,
//  gameLocked : false,
//  turnOfPlayer : undefined
//};
// TODO : @mayank : no globals are needed , use your client store
var saveGameData = function(value) {
  let currentGameState = phaserGame.state.states.play.cells.children;
  let len = currentGameState.length;
  var tempCells = new Array(9);
  for(let i = 0 ; i < len ; i++) {
    tempCells[i]=currentGameState[i].frame ;
  }
  globalVariableInstance.set("boardStatus",{cells : tempCells});
  console.log("Board Status recorded on pause : ",globalVariableInstance.get("boardStatus"));
  let roomData = {
    colorPlayer  : globalVariableInstance.get("playerMark"),
    difficulty  : 2,
    board :  globalVariableInstance.get("boardStatus"),
    playerData  : globalVariableInstance.get("playerData"),
    gameOver  : value,
    winner : globalVariableInstance.get("win")
  };
  kapow.roomStore.set("game_data", JSON.stringify(roomData), function () {
    console.log("Storing room data was successful.",roomData);
  }, function(error) {
    console.log("Storing room data Failed : ",error);
  });
};

//var room = null;
//var screenState = 0 ;
//var playerData ;
//var boardStatus = {cells: new Array(9)};
//var gameResume = false ;
//var botLevel = -1 ;
//var win = 0 ;
//var playerMark = 0 ;
//var opponentMark = 0 ;
//var gameOver = false ;
//var gameType = null;
//var opponentData;
//var gameLocked = false ;
//var turnOfPlayer;
function compare(a,b) {
  if(a.data.turnSequenceID < b.data.turnSequenceID) {
    return -1 ;
  }
  else {
    return 1;
  }
}
var parseRoomAndRedirectToGame = function() {
  if (globalVariableInstance.get("room") == null) {
    console.log("Room is null, hence not redirecting to game");
  }
  else {
    console.log('Parsing Room.');
    var players = globalVariableInstance.get("room").players;
    if (players.length >= 1) {
      if (players.length === 2) {
          if (players[0].id === globalVariableInstance.get("playerData").id) {
              globalVariableInstance.set("opponentData", players[1]);
              globalVariableInstance.set("playerData", players[0]);
          }
          else {
              globalVariableInstance.set("opponentData", players[0]);
              globalVariableInstance.set("playerData", players[1]);
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
                  globalVariableInstance.set("gameOver", true) ;
                  if(messagesHistory[i].data.type === "result") {
                    if(messagesHistory[i].data.ranks[globalVariableInstance.get("playerData").id] === messagesHistory[i].data.ranks[globalVariableInstance.get("opponentData").id]) {
                      globalVariableInstance.set("turnOfPlayer", 0) ;
                    }
                    else if(messagesHistory[i].data.ranks[globalVariableInstance.get("playerData").id] === 1) {
                      globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("opponentData")) ;
                    }
                    else if(messagesHistory[i].data.ranks[globalVariableInstance.get("playerData").id] === 2) {
                      globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("playerData")) ;
                    }
                    else {
                      console.log("Player Turn couldn't be detrminded");
                    }
                  }
                  else if(messagesHistory[i].data.type === "resignation" || messagesHistory[i].data.type === "timeout") {
                    console.log("Outcome  data :",messagesHistory[i].data.ranks[globalVariableInstance.get("playerData").id]);
                    if(messagesHistory[i].data.ranks[globalVariableInstance.get("playerData").id] === messagesHistory[i].data.ranks[globalVariableInstance.get("opponentData").id]) {
                      globalVariableInstance.set("turnOfPlayer", 0) ;
                    }
                    else if(messagesHistory[i].data.ranks[globalVariableInstance.get("playerData").id] === 1) {
                      globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("opponentData")) ;
                      console.log("Turn of player set to : ",globalVariableInstance.get("opponentData").id);
                    }
                    else if(messagesHistory[i].data.ranks[globalVariableInstance.get("playerData").id] === 2) {
                      globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("playerData")) ;
                      console.log("Turn of player set to : ",globalVariableInstance.get("playerData").id);
                    }
                    else {
                      console.log("Player Turn couldn't be determined");
                    }
                  }
                }
              }
              console.log("Move History sorted according to sequence number",history);
              if(history.length > 0) {
                globalVariableInstance.set("boardStatus", {cells : history[0].data.moveData.board});
                if(history[0].senderId === globalVariableInstance.get("playerData").id) {
                  if(globalVariableInstance.get("gameOver") === false) {
                    globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("opponentData")) ;
                  }
                }
                else if(history[0].senderId === globalVariableInstance.get("opponentData").id) {
                  if(globalVariableInstance.get("gameOver") === false) {
                    globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("playerData")) ;
                  }
                }
                else {
                  if(globalVariableInstance.get("gameOver") === false) {
                    console.log("Current Turn can't be determined");
                  }
                }
              }
              else if(globalVariableInstance.get("gameOver") !== true){
                globalVariableInstance.set("turnOfPlayer", undefined) ;
              }
            },
            function() {
              console.log('fetchHistory Failed')
            });
      }
      console.log("Redirecting to game...",globalVariableInstance.get("opponentData"));
      globalVariableInstance.set("gameType", 'friend');
      if(globalVariableInstance.get("opponentData") !== undefined && globalVariableInstance.get("opponentData").affiliation === "accepted") {
        phaserGame.state.start('playLoad');
      }
      else if(globalVariableInstance.get("opponentData") != undefined && (globalVariableInstance.get("opponentData").affiliation === "left" || globalVariableInstance.get("playerData").affiliation === "left")) {
        globalVariableInstance.set("gameOver", true);
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
        globalVariableInstance.set("room", roomObj);
        globalVariableInstance.set("playerMark", 2) ;
        globalVariableInstance.set("opponentMark", 1) ;
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
        globalVariableInstance.set("room", roomObj);
        console.log(globalVariableInstance.get("room"));
        kapow.getUserInfo(function (userObj) {
                console.log("Client getUserInfoSuccess - User: " + JSON.stringify(userObj));
                user = userObj.player;
                globalVariableInstance.set("playerData",user);
                if(globalVariableInstance.get("room") !== null) { //Game already created sometime earlier
                  globalVariableInstance.set("gameResume", true);
                  if(globalVariableInstance.get("room").players.length > 1) {
                    globalVariableInstance.set("gameType","friend");
                  }
                  else if(globalVariableInstance.get("room").lockStatus === "locked"){
                    globalVariableInstance.set("gameType", "solo");
                    kapow.roomStore.get('game_data',function(value) {
                      if(value) {
                        let valueJSON = JSON.parse(value);
                        console.log(valueJSON);
                        globalVariableInstance.set("playerMark", valueJSON.colorPlayer);
                        globalVariableInstance.set("botLevel", valueJSON.difficulty);
                        globalVariableInstance.set("boardStatus", valueJSON.board);
                        globalVariableInstance.set("playerData", valueJSON.playerData);
                        globalVariableInstance.set("gameOver", valueJSON.gameOver);
                        globalVariableInstance.set("gameLocked", globalVariableInstance.get("gameOver"));
                        globalVariableInstance.set("win", valueJSON.winner);
                      }
                      else {
                        console.log('Game Variables Not set');
                      }
                    }, function(error) {
                      console.log("Nothing Found : ",error);
                    });
                  }
                  else {
                    globalVariableInstance.set("gameType", "friend");
                  }
                }
                else {
                  globalVariableInstance.set("gameResume", false);
                }
                console.log("room : ",globalVariableInstance.get("room"));
                phaserGame.state.start('boot');
            }, function () {
            console.log("Client getUserInfo failure");
        });

    },
    onGameEnd : function(outcome) {
      console.log("CLIENT : Game Ended",outcome);
      if(outcome.type === "resignation" || outcome.type === "timeout"){
        if(outcome.ranks[globalVariableInstance.get("playerData").id] === 1) {
          console.log("Game Won");
          gameEndHandler(2);
        }
        else {
          console.log("Game Lost");
          gameEndHandler(1);
        }
      }
      if(outcome.ranks[globalVariableInstance.get("playerData").id] === 1 && outcome.ranks[globalVariableInstance.get("opponentData").id] === 1) {
        console.log("Game Draw");
      }
      else if(outcome.ranks[globalVariableInstance.get("playerData").id] === 1) {
        console.log("Game Won");
      }
      else {
        console.log("Game Lost");
      }
    },
    onPlayerJoined: function(playerObj) {
      console.log("CLIENT onPlayerJoined - " + JSON.stringify(globalVariableInstance.get("playerData")));
      //onAffiliationChange();
    },
    onInviteRejected: function(playerObj) {
        console.log("Client onInviteRejected - " + JSON.stringify(globalVariableInstance.get("playerData")));
        onAffiliationChange();
    },
    onPlayerLeft: function(playerObj) {
        console.log("Client onPlayerLeft - " + JSON.stringify(globalVariableInstance.get("playerData")));
    },
    onTurnChange : function(playerObj) {
      console.log("Player Turn Changed to : " + JSON.stringify(playerObj));
      if(playerObj.id === globalVariableInstance.get("playerData").id) {
        globalVariableInstance.set("turnOfPlayer", playerObj) ;
      }
      else {
        globalVariableInstance.set("turnOfPlayer", undefined) ;
      }
    },
    onPause: function() {
      console.log('On Pause Triggered.');
    },
    onResume:function() {
      if(globalVariableInstance.get("screenState") === 1 && globalVariableInstance.get("gameType") === "friend") {
        globalVariableInstance.set("gameResume", true);
        parseRoomAndRedirectToGame();
      }
      console.log('On Resume Triggered.');
    },
    onMessageReceived : function (message) {
      console.log('CLIENT : Message Received - ',message);
      if(globalVariableInstance.get("gameLayoutLoaded") === true && message.type === "move" && message.senderId === globalVariableInstance.get("opponentData").id) {
        for(var i = 0 ; i < 9 ; i++) {
          phaserGame.state.states.play.cells.children[i].frame = message.data.moveData.board[i];
        }
        gameLayoutVariables.opponentProfilePic.alpha = 0.3;
        gameLayoutVariables.playerProfilePic.alpha = 1;
        gameLayoutVariables.turnText.text = "YOUR TURN";
        globalVariableInstance.set("boardStatus", {cells : message.data.moveData.board});
        if(globalVariableInstance.get("playerMark") === 0) {
          globalVariableInstance.set("playerMark", 2);
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
      else if(globalVariableInstance.get("gameLayoutLoaded") === false && message.type === "move" && message.data.type === "markSet") {
        onAffiliationChange();
      }
    },
    onBackButtonPressed:  function() {
      console.log('BackButton Triggered.');
      if(globalVariableInstance.get("screenState") === 1) {
        kapow.unloadRoom(function() {
          console.log('Room Succesfully Unloaded');
        },function() {
          console.log('Room Unloading Failed');
        });
        globalVariableInstance.set("gameResume", false);
        globalVariableInstance.set("room", null);
        globalVariableInstance.set("playerMark", 0);
        globalVariableInstance.set("gameType", null);
        globalVariableInstance.set("botLevel",-1);
        globalVariableInstance.set("boardStatus", {cells :new Array(9)});
        globalVariableInstance.set("opponentData", undefined);
        globalVariableInstance.set("turnOfPlayer", undefined);
        globalVariableInstance.set("gameOver", false);
        globalVariableInstance.set("win", 0);
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
