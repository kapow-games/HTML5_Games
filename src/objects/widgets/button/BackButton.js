"use strict";

import GameManager from "../../../controller/GameManager";

export default class BackButton extends Phaser.Button {
    constructor(arg) {
        let backButtonClickHandler = function() {
            GameManager.playTapSound();
            this.clickHandler();
        };
        super(arg.game, arg.posX, arg.posY, arg.label, backButtonClickHandler);
        this.anchor.setTo(arg.anchorX, arg.anchorY);
        this.clickHandler = arg.callback;
    }

    enableInput(isEnabled) {
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) { // TODO :  FIX later: remove priority instead disable it
        this.input.priorityID = priorityID;
    }
}