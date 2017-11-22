"use strict";

export default class StartNewGameTopButton extends Phaser.Button {
    constructor(obj) {
        super(obj.phaserGameObj, obj.posX, obj.posY, obj.label, () => this.buttonHandler, () => this, obj.overFrame, obj.outFrame, obj.downFrame, obj.upFrame);

        this.slideDirection = 0;
        this.startNewGameBottomSlider = obj.startNewGameBottom;
        this.anchor.setTo(obj.anchorX, obj.anchorY);
        this.onInputDown.add(this.startNewGameTopInputDown, this);
        this.onInputUp.add(this.startNewGameTopInputUp, this);
        this.onInputOut.add(this.startNewGameTopInputUp, this);
        this.gameModeSolo = obj.gameModeSolo;
        this.gameModeFriend = obj.gameModeFriend;
        this.gameModeRandom = obj.gameModeRandom;

        //Animation
        this.arrowRotateRightToDown = obj.phaserGameObj.add.tween(obj.arrowObj).to({angle: 90}, 200, Phaser.Easing.Linear.None);// TODO : typical example of how to use ENUMS or alternate names
        this.arrowRotateDownToRight = obj.phaserGameObj.add.tween(obj.arrowObj).to({angle: 0}, 200, Phaser.Easing.Linear.None);

        this.slideStatsDown = this.add.tween(obj.stats).to({y: 1314}, 300, "Quart.easeOut");
        this.slideLeaderboardDown = this.add.tween(obj.leaderboard).to({y: 1500}, 300, "Quart.easeOut");

        this.slideStatsUp = this.add.tween(obj.stats).to({y: 1182}, 300, "Quart.easeOut");
        this.slideLeaderboardUp = this.add.tween(obj.leaderboard).to({y: 1368}, 300, "Quart.easeOut");
        this.slideNewGameBottomDown = this.add.tween(obj.startNewGameBottom).to({y: 1104}, 300, "Quart.easeOut");
        this.slideNewGameBottomUp = this.add.tween(obj.startNewGameBottom).to({y: 1020}, 300, "Quart.easeOut");
        this.slideGameModeFriendDown = this.add.tween(obj.gameModeFriend).to({y: 1104}, 300, "Quart.easeOut");
        this.slideGameModeFriendUp = this.add.tween(obj.gameModeFriend).to({y: 1020}, 300, "Quart.easeOut");
        this.slideGameModeRandomDown = this.add.tween(obj.gameModeRandom).to({y: 1104}, 300, "Quart.easeOut");
        this.slideGameModeRandomUp = this.add.tween(obj.gameModeRandom).to({y: 1020}, 300, "Quart.easeOut");
        this.slideGameModeSoloDown = this.add.tween(obj.gameModeSolo).to({y: 1104}, 300, "Quart.easeOut");
        this.slideGameModeSoloUp = this.add.tween(obj.gameModeSolo).to({y: 1020}, 300, "Quart.easeOut");
    }

    startNewGameTopInputDown() {
        this.startNewGameBottomSlider.setFrame(1);
    }

    startNewGameTopInputUp() {
        this.startNewGameBottomSlider.setFrame(0);
    }

    buttonHandler() {
        console.log('New Game Button Clicked');
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
    }
}