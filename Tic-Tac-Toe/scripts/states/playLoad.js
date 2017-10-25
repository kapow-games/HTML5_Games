'use strict';
var playLoad = function() {};
playLoad.prototype = {
  preload: function() {
    gameGlobalVariables.screenState = 1;
    if(gameGlobalVariables.gameType === "friend") {
      kapow.invokeRPC("playerMark", gameGlobalVariables.playerData,
          function(playerMarkAssignedByServer) {
            console.log("playerMark - success : obj:",playerMarkAssignedByServer);
            console.log("Turn of player during playload :",gameGlobalVariables.turnOfPlayer);
            gameGlobalVariables.playerMark = playerMarkAssignedByServer;
            if(gameGlobalVariables.turnOfPlayer === undefined) {
              gameGlobalVariables.turnOfPlayer = gameGlobalVariables.playerMark === 1 ? gameGlobalVariables.playerData : gameGlobalVariables.opponentData;
            }
            else {
              console.log("playerMark set already as",gameGlobalVariables.playerData);
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
