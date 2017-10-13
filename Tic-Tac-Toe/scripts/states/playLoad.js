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
    phaserGame.add.sprite(0, 0, 'arena');
    this.sprite = phaserGame.add.sprite(phaserGame.world.centerX, phaserGame.world.centerY, 'loaderSpinner');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.spriteTween = phaserGame.add.tween(this.sprite).to({angle: 359}, 400, null, true, 0, Infinity);
    this.spriteTween.start();
  },
  update  : function() {
  }
}
