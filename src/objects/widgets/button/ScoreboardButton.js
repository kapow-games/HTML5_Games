"use strict";

import kapowClientController from "../../../kapow/KapowClientController";
import GameManager from "../../../controller/GameManager";

export default class ScoreboardButton extends Phaser.Button {
    constructor(arg) {
        let scoreboardClickHandler = function () {
            console.log('Leaderboard Button Clicked');
            GameManager.playTapSound();
            kapowClientController.handleDisplayScoreboard({'metric': 'points', 'interval': 'alltime'});// TODO : same as OnGoingGameButton
        };
        super(arg.game, arg.posX, arg.posY, arg.label, scoreboardClickHandler, null, arg.overFrame, arg.outFrame, arg.downFrame, arg.upFrame);
        this.anchor.setTo(arg.anchorX, arg.nchorY);
        this.inputEnabled = arg.inputEnabled;
    }
};