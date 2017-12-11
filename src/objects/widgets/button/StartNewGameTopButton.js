"use strict";

import GameManager from "../../../controller/GameManager";

export default class StartNewGameTopButton extends Phaser.Button {
    constructor(arg) {
        let startNewGameTopButtonHandler = function () {
            GameManager.playTapSound();
            if (this.slideDirection === 0) {
                this.arrowRotateRightToDown.start();
                this.slideNewGameBottomDown.start();
                this.slideGameModeSoloDown.start();
                this.slideGameModeRandomDown.start();
                this.slideGameModeFriendDown.start();
                this.slideStatsDown.start();
                this.slideLeaderboardDown.start();
                this.gameModeSolo.enableInput(true);
                this.gameModeFriend.enableInput(true);
                this.gameModeRandom.enableInput(true);
            }
            else {
                this.arrowRotateDownToRight.start();
                this.slideGameModeFriendUp.start();
                this.slideGameModeRandomUp.start();
                this.slideGameModeSoloUp.start();
                this.slideNewGameBottomUp.start();
                this.slideLeaderboardUp.start();
                this.slideStatsUp.start();
                this.gameModeSolo.enableInput(false);
                this.gameModeFriend.enableInput(false);
                this.gameModeRandom.enableInput(false);
            }
            this.slideDirection = (this.slideDirection + 1) % 2;
        };
        super(arg.game, arg.posX, arg.posY, arg.label, startNewGameTopButtonHandler, null, arg.overFrame, arg.outFrame, arg.downFrame, arg.upFrame);
        this.arrowRight = this.game.add.sprite(972, 1062, 'arrowRight');
        this.arrowRight.anchor.setTo(0.5, 0.5);
        arg.arrowObj = this.arrowRight;

        this.slideDirection = 0;
        this.startNewGameBottomSlider = arg.startNewGameBottomSlider;
        this.anchor.setTo(arg.anchorX, arg.anchorY);
        this.onInputDown.add(this._startNewGameTopInputDown, this);
        this.onInputUp.add(this._startNewGameTopInputUp, this);
        this.onInputOut.add(this._startNewGameTopInputUp, this);
        this.gameModeSolo = arg.gameModeSolo;
        this.gameModeFriend = arg.gameModeFriend;
        this.gameModeRandom = arg.gameModeRandom;

        //Animation
        this.arrowRotateRightToDown = arg.game.add.tween(arg.arrowObj).to({angle: 90}, 200, Phaser.Easing.Linear.None);
        this.arrowRotateDownToRight = arg.game.add.tween(arg.arrowObj).to({angle: 0}, 200, Phaser.Easing.Linear.None);

        this.slideStatsDown = arg.game.add.tween(arg.stats).to({y: 1272}, 300, "Quart.easeOut");
        this.slideLeaderboardDown = arg.game.add.tween(arg.scoreboard).to({y: 1458}, 300, "Quart.easeOut");

        this.slideStatsUp = arg.game.add.tween(arg.stats).to({y: 1140}, 300, "Quart.easeOut");
        this.slideLeaderboardUp = arg.game.add.tween(arg.scoreboard).to({y: 1326}, 300, "Quart.easeOut");

        this.slideNewGameBottomDown = arg.game.add.tween(arg.startNewGameBottomSlider).to({y: 1062}, 300, "Quart.easeOut");
        this.slideNewGameBottomUp = arg.game.add.tween(arg.startNewGameBottom).to({y: 978}, 300, "Quart.easeOut");
        this.slideGameModeFriendDown = arg.game.add.tween(arg.gameModeFriend).to({y: 1062}, 300, "Quart.easeOut");
        this.slideGameModeFriendUp = arg.game.add.tween(arg.gameModeFriend).to({y: 978}, 300, "Quart.easeOut");
        this.slideGameModeRandomDown = arg.game.add.tween(arg.gameModeRandom).to({y: 1062}, 300, "Quart.easeOut");
        this.slideGameModeRandomUp = arg.game.add.tween(arg.gameModeRandom).to({y: 978}, 300, "Quart.easeOut");
        this.slideGameModeSoloDown = arg.game.add.tween(arg.gameModeSolo).to({y: 1062}, 300, "Quart.easeOut");
        this.slideGameModeSoloUp = arg.game.add.tween(arg.gameModeSolo).to({y: 978}, 300, "Quart.easeOut");
    }

    _startNewGameTopInputDown() {
        this.startNewGameBottomSlider.frame = 1;
    }

    _startNewGameTopInputUp() {
        this.startNewGameBottomSlider.frame = 0;
    }
};