"use strict";

export default class BackButton extends Phaser.Button {
    constructor(arg) {
        super(arg.game, arg.posX, arg.posY, arg.label, arg.callback);
        this.anchor.setTo(arg.anchorX, arg.anchorY);
    }

    enableInput(isEnabled) {
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) { // TODO :  FIX later: remove priority instead disable it
        this.input.priorityID = priorityID;
    }
}