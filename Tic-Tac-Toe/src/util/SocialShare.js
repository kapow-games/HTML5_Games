'use strict';

export default class SocialShare {
    constructor(ticTacToeGame, val) {
        this.game = ticTacToeGame;
        this.shareText = (val === "draw" || val === "loss") ? "I just played a game of Tic Tac Toe on Kapow. Join Kapow now to play with me!" : "I just won a game of Tic Tac Toe on Kapow. Join Kapow now to beat me!"
    }

    shareButton(x, y, medium, buttonID) {
        return this.game.add.button(x, y, buttonID, function () {
            var shareDarkOverlay = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'shareLoadBackground');
            shareDarkOverlay.anchor.setTo(0.5);
            this.game.stage.addChild(shareDarkOverlay);

            var shareLoad = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderSpinner');
            shareLoad.anchor.setTo(0.5);
            this.game.stage.addChild(shareLoad);

            let shareLoadTween = this.game.add.tween(shareLoad).to({angle: 359}, 400, null, true, 0, Infinity);
            // shareLoad.kill();
            shareLoadTween.start();
            console.log(buttonID + " share clicked");
            // shareLoad.reset(this.game.world.centerX, this.game.world.centerY);
            kapow.social.share(this.shareText, medium, function () { // TODO : either use this.shareText here or keep shareTxt in closure http://speakingjs.com/es5/ch17.html#private_data_for_objects
                    shareLoad.kill();
                    shareDarkOverlay.kill();
                    console.log(buttonID + "Fb share Successfull");
                },
                function (error) {
                    shareLoad.kill();
                    shareDarkOverlay.kill()
                    console.log(buttonID, "Share Failed", error);
                });
        }.bind(this));
    }
}