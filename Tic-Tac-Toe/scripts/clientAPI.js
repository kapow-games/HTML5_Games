var room = null;
var playerData ;
var boardStatus = {cells: []};
var game = {
    onLoad: function(roomObj) {
        console.log("Client onLoad - " + JSON.stringify(roomObj));
        room = roomObj;
        kapow.roomStore.get('game_data',function(value) {
          console.log(value);
        }, function(error) {
          console.log("Nothing Found");
        });
        console.log(room);
        kapow.getUserInfo(function (userObj) {
                console.log("Client getUserInfoSuccess - User: " + JSON.stringify(userObj));
                user = userObj.player;
                playerData = userObj;
                // parseRoomAndRedirectToGame();
            }, function () {
            console.log("Client getUserInfo failure");
        });
    },
    onPause: function() {
      let currentGameState = phaserGame.state.states.play.cells.children;
      let len = currentGameState.length;
      for(let i = 0 ; i < len ; i++) {
        boardStatus.cells.push(currentGameState[i].frame) ;
      }
      console.log("Board Status recorded on pause : ",boardStatus);
      let roomData = {
        colorPlayer: playerMark,
        difficulty: botLevel,
        board:  boardStatus,
        playerData: playerData
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
