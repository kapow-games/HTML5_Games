
var gameVariables = {
  room : null,
  player : null,
  playermark : null,
  difficulty : null,
  board : null,
  gameinProgress : false ,
  gameResult : null,
  winner  : null
};

var GameManager = function() {};
GameManager.prototype = {
  init : function(game) {
    GameManager.game = game;
    this.resetVariables();
    // this.readGameStorage();
    if (gameVariables.room) {
        this.loadRoomData();
    }
    else {
        //Load The Menu
    }
  },
  resetVariables : function() {
    gameVariables.room = null;
    gameVariables.player = null;
    gameVariables.playermark = null;
    gameVariables.difficulty = null;
    gameVariables.board = null;
    gameVariables.gameinProgress = false;
    gameVariables.gameResult = null;
    gameVariables.winner = null;
  },
  loadRoomData : function() {
    kapow.getRoomInfo(function (room) {
      gameVariables.room = room;
      kapow.roomStore.get("game_data", onRoomDataRetrieved(), function (error) {
          console.log("failed retrieving room data", error);
      });
    }, function (error) {
      GameManager.log("failed retrieving room data", error);
    });
  },
  onRoomDataRetrieved : function (value) {
    console.log(value);
        // if (value) {
        //     gameVariables.roomData = JSON.parse(value);
        // }
        // else {
        //     gameVariables.roomData = null;
        // }
        // if (gameVariables.roomData !== null) {
        //     gameVariables.player = gameVariables.roomData.player;
        //
        // }
        // else {
        //
        // }
  }
}

var room = null;
var playerData ;
var boardStatus = {cells: new Array(9)};
var gameResume = false ;
var botLevel = -1 ;
var win = 0 ;
var playerMark = 0 ;
var game = {
    onLoad: function(roomObj) {
        console.log("Client onLoad - " + JSON.stringify(roomObj));
        room = roomObj;
        kapow.getUserInfo(function (userObj) {
                console.log("Client getUserInfoSuccess - User: " + JSON.stringify(userObj));
                user = userObj.player;
                playerData = userObj;
                // parseRoomAnxdRedirectToGame();
            }, function () {
            console.log("Client getUserInfo failure");
        });
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
              boardStatus = valueJSON.board;
            }
            else {
              console.log('Game Variables Not set');
            }
          }, function(error) {
            console.log("Nothing Found : ",error);
          });
        }
        else {
          //New Game;
        }
        console.log("room : ",room);
    },
    onPause: function() {
      let currentGameState = phaserGame.state.states.play.cells.children;
      let len = currentGameState.length;
      for(let i = 0 ; i < len ; i++) {
        // boardStatus = boar
        boardStatus.cells[i]=currentGameState[i].frame ;
      }
      console.log("Board Status recorded on pause : ",boardStatus);
      let roomData = {
        colorPlayer  : playerMark,
        difficulty  : botLevel,
        board :  boardStatus,
        playerData  : playerData
        // lastMessageID: lastMessageID,
      };
      kapow.roomStore.set("game_data", JSON.stringify(roomData), function () {
        console.log("Storing room data was successful.",roomData);
      }, function(error) {
        console.log("Storing room data Failed : ",error);
      });
    },
    onResume:function() {

    },
    onBackButtonPressed:  function() {
      console.log("Hi");
      return false;
    }
  }
