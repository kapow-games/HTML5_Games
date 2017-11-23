'use strict';
import globalVariableInstance from "../objects/store/gameGlobalVariables";
import Background from "../objects/widgets/icons/Background";

export class PlayLoad extends Phaser.State {
    preload() {
        globalVariableInstance.set("screenState", 1);
        if (globalVariableInstance.get("gameType") === "friend") {
            kapow.invokeRPC("playerMark", globalVariableInstance.get("playerData"),
                function (playerMarkAssignedByServer) {
                    console.log("playerMark fetch from server - Sxuccess : obj:", playerMarkAssignedByServer);
                    console.log("Turn of player during playload :", globalVariableInstance.get("turnOfPlayer"));

                    globalVariableInstance.set("playerMark", playerMarkAssignedByServer);

                    if (globalVariableInstance.get("turnOfPlayer") === undefined) {
                        globalVariableInstance.set("turnOfPlayer", globalVariableInstance.get("playerMark") === 1 ? globalVariableInstance.get("playerData") : globalVariableInstance.get("opponentData"));
                    }
                    else {
                        console.log("playerMark set already as : ", globalVariableInstance.get("playerData"));
                    }
                    this.game.state.start('play');
                }.bind(this),
                function (error) {
                    console.log("playerMark fetch from server - Failure", error);
                }
            );
        }
        else {
            this.game.state.start('play');
        }
    }

    create() {
        this.bg = new Background({
            game: this.game,
            posX: 0,
            posY: 0,
            label: 'arena',
            anchorX: 0,
            anchorY: 0
        });

        this.loaderSpinner = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderSpinner');

        this.loaderSpinner.anchor.setTo(0.5, 0.5);
        this.spriteTween = this.game.add.tween(this.loaderSpinner).to({angle: 359}, 400, null, true, 0, Infinity);
        this.spriteTween.start();
    }

    update() {
    }
}