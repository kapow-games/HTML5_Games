'use strict';

import MESSAGE from "../const/MESSAGES";
import kapowClientController from "../kapow/KapowClientController";

export default class SocialShare {
    constructor(ticTacToeGame, val) {
        this.game = ticTacToeGame;
        this.shareText = (val === "draw" || val === "loss") ? MESSAGE.SHARE_OTHER : MESSAGE.SHARE_WIN;
    }

    shareButton(x, y, medium, buttonID) {
        return this.game.add.button(x, y, buttonID, function () {
            let shareDarkOverlay = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'shareLoadBackground');
            shareDarkOverlay.anchor.setTo(0.5);
            this.game.stage.addChild(shareDarkOverlay);

            let shareLoad = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderSpinner');
            shareLoad.anchor.setTo(0.5);
            this.game.stage.addChild(shareLoad);

            let shareLoadTween = this.game.add.tween(shareLoad).to({angle: 359}, 400, null, true, 0, Infinity);
            shareLoadTween.start();
            console.log(buttonID + " share clicked");
            kapowClientController.handleSocialShare(this.shareText, medium, function () {
                    shareLoad.kill();
                    shareDarkOverlay.kill();
                    console.log(buttonID + "Fb share successful.");
                },
                function (error) {
                    shareLoad.kill();
                    shareDarkOverlay.kill();
                    console.log(buttonID, "Share Failed", error);
                });
        }.bind(this));
    }
}