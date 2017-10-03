'use strict';
var playLoad = function() {};
playLoad.prototype = {
  preload: function() {
    screenState = 1;
    if(gameType === "friend") {
      kapow.invokeRPC("playerMark", playerData,
          function(playerMarkAssignedByServer) {
            console.log("playerMark - success : obj:",playerMarkAssignedByServer);
            playerMark = playerMarkAssignedByServer;
            if(turnOfPlayer === undefined) {
              turnOfPlayer = playerMark === 1 ? playerData : opponentData;
            }
            else {
              console.log("playerMark set already as",playerData);
            }
            phaserGame.state.start('play');
          },
          function(error) {
              console.log("playerMark - failure",error);
          }
      );
    }
    else {
      phaserGame.state.start('play');
    }
  },
  create : function() {

  }
}
