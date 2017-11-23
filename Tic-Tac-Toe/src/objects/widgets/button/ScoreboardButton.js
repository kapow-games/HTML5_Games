"use strict";

export default class ScoreboardButton extends Phaser.Button {  // TODO : its a scoreboard not leaderboard :P
    constructor(obj) {
        super(obj.game, obj.posX, obj.posY, obj.label, () => this.clickHandler, () => this, obj.overFrame, obj.outFrame, obj.downFrame, obj.upFrame);
        this.anchor.setTo(obj.anchorX, obj.nchorY);
        this.inputEnabled = obj.inputEnabled;
    }

    clickHandler() {
        console.log('Leaderboard Button Clicked');
        kapow.boards.displayScoreboard({'metric': 'points', 'interval': 'alltime'});
    }

}