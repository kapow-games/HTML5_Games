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
var gameOver = false ;
var opponentData = null ;
var gameLocked = false ;

var parseRoomAndRedirectToGame = function() {
  if (room == null) {
      console.log("Room is null, hence not redirecting to game");
  } else {
      var players = room.players;
      if (players.length >= 1) {
          if (players.length === 2) {
              if (players[0].id === playerData.id) {
                  opponent = players[1];
                  user = players[0];
              } else {
                  opponent = players[0];
                  user = players[1];
              }
          }
          if (players.length === 1) {
              if (players[0].id === playerData.id) {
                  playerData = players[0];
              } else {
                  opponentData = players[0];
              }
          }
          console.log("Redirecting to game...");
          console.log("\nUser: " + JSON.stringify(user) + "\nOpponent: " + JSON.stringify(opponent));
          phaserGame.state.start('play');
      } else {
          console.log("Room not having player...");
      }
  }
};

var game = {
    onLoad: function(roomObj) {
        console.log("Client onLoad - " + JSON.stringify(roomObj));
        room = roomObj;
        console.log(room);
        kapow.getUserInfo(function (userObj) {
                console.log("Client getUserInfoSuccess - User: " + JSON.stringify(userObj));
                user = userObj.player;
                playerData = userObj;
                if(room !== null) {
                  gameResume = true ;
                  kapow.roomStore.get('game_data',function(value) {
                    // console.log("roomStore.get : ",value);
                    if(value) {
                      let valueJSON = JSON.parse(value);
                      console.log(valueJSON);
                      //Set Up a layout Redirecct game;
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
                  gameResume = false ;
                  //New Game;
                }
                console.log("room : ",room);
                phaserGame.state.start('boot');
                // parseRoomAnxdRedirectToGame();
            }, function () {
            console.log("Client getUserInfo failure");
        });

    },
    onPause: function() {
      console.log('On Pause Triggered.');
      // if(screenState === 1) { //2 goes for play screen and 0 for any other
      //   saveGameData(gameOVer);
      // }
    },
    onResume:function() {
      console.log('On Resume Triggered.');
    },
    onBackButtonPressed:  function() {
      console.log('BackButton Triggered.');
      if(screenState === 1)
        phaserGame.state.start('menu');
      else {
        kapow.close();
      }
      // if(screenState === 1) { //2 goes for play screen and 0 for any other
      //   saveGameData(false);
      // }
      // phaserGame.state.start();
      return true;
    }
  }
