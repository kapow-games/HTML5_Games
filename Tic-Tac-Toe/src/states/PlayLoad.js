'use strict';
import gameInfo from "../objects/store/GameGlobalVariables";
import Background from "../objects/widgets/icons/Background";
import gameConst from "../gameParam/gameConst";

export class PlayLoad extends Phaser.State {
    preload() {
        gameInfo.set("screenState", 1);
        if (gameInfo.get("gameType") === "friend") {
            kapow.invokeRPC("playerMark", gameInfo.get("playerData"),
                function (playerMarkAssignedByServer) {
                    console.log("playerMark fetch from server - Success : obj:", playerMarkAssignedByServer);
                    console.log("Turn of player during playload :", gameInfo.get("turnOfPlayer"));

                    gameInfo.set("playerMark", playerMarkAssignedByServer);

                    if (gameInfo.get("turnOfPlayer") === undefined) {
                        gameInfo.set("turnOfPlayer", gameInfo.get("playerMark") === gameConst.X ? gameInfo.get("playerData") : gameInfo.get("opponentData"));
                    }
                    else {
                        console.log("playerMark set already as : ", gameInfo.get("playerData"));
                    }
                    this.game.state.start('Play');
                }.bind(this),
                function (error) {
                    console.log("playerMark fetch from server - Failure", error);
                }
            );
        }
        else {
            this.game.state.start('Play');
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
        this.game.stage.addChild(this.bg);

        this.loaderSpinner = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderSpinner');
        this.game.stage.addChild(this.loaderSpinner);

        this.loaderSpinner.anchor.setTo(0.5, 0.5);
        this.spriteTween = this.game.add.tween(this.loaderSpinner).to({angle: 359}, 400, null, true, 0, Infinity);
        this.spriteTween.start();
    }

    update() {
    }

    shutdown() {
        for (let i = this.game.stage.children.length - 1; i >= 0; i--) {
            this.game.stage.removeChild(this.game.stage.children[i]);
        }
    }
}