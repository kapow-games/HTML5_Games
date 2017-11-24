"use strict";

export default class ScoreboardButton extends Phaser.Button {  // TODO : its a scoreboard not leaderboard :P
    constructor(arg) {
        let scoreboardClickHandler = function() {
            console.log('Leaderboard Button Clicked');
            kapow.boards.displayScoreboard({'metric': 'points', 'interval': 'alltime'});
        };
        super(arg.game, arg.posX, arg.posY, arg.label, scoreboardClickHandler, null, arg.overFrame, arg.outFrame, arg.downFrame, arg.upFrame);
        this.anchor.setTo(arg.anchorX, arg.nchorY);
        this.inputEnabled = arg.inputEnabled;
    }
};