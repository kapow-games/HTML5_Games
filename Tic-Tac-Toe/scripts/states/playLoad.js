'use strict';
export class PlayLoad extends Phaser.State {
    preload() {
        globalVariableInstance.set("screenState", 1);
        if(globalVariableInstance.get("gameType") === "friend") {
          kapow.invokeRPC("playerMark", globalVariableInstance.get("playerData"),
              function(playerMarkAssignedByServer) {
                console.log("playerMark - success : obj:",playerMarkAssignedByServer);
                console.log("Turn of player during playload :",globalVariableInstance.get("turnOfPlayer"));
                globalVariableInstance.set("playerMark", playerMarkAssignedByServer);
                if(globalVariableInstance.get("turnOfPlayer") === undefined) {
                  globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("playerMark") === 1 ? globalVariableInstance.get("playerData") : globalVariableInstance.get("opponentData"));
                }
                else {
                  console.log("playerMark set already as",globalVariableInstance.get("playerData"));
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
      }
      create() {
        phaserGame.add.sprite(0, 0, 'arena');
        this.sprite = phaserGame.add.sprite(phaserGame.world.centerX, phaserGame.world.centerY, 'loaderSpinner');
        this.sprite.anchor.setTo(0.5, 0.5);
        this.spriteTween = phaserGame.add.tween(this.sprite).to({angle: 359}, 400, null, true, 0, Infinity);
        this.spriteTween.start();
      }
      update() {
      }
}

