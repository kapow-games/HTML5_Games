"use strict";

export default class Background extends Phaser.Image {
    constructor(arg) {
        super(arg.game, arg.posX, arg.posY, arg.label);
        this.anchor.setTo(arg.anchorX, arg.anchorY);
    }

    enableInput(isEnabled) {
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) {
        this.input.priorityID = priorityID;
    }
}