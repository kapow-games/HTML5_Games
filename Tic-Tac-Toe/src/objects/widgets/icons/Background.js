"use strict";

export default class Background extends Phaser.Image {
    constructor(arg) {
        super(arg.game, arg.posX, arg.posY, arg.label); // TODO @mayank: same (redundant vars)
        this.anchor.setTo(arg.anchorX, arg.anchorY);
    }

    enableInput(isEnabled) { // TODO : rename to enableInput and take args as isEnabled boolean
        console.log("Background inputEnabled changed to : ", isEnabled);
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) { // TODO : same
        this.input.priorityID = priorityID;
    }
}