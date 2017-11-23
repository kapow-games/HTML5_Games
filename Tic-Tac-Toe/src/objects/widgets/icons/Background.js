"use strict";

export default class Background extends Phaser.Sprite {
    constructor(obj) {
        console.log(obj.game);
        super(obj.game, obj.posX, obj.posY, obj.label); // TODO @mayank: same (redundant vars)
        this.anchor.setTo(obj.anchorX, obj.anchorY);
    }

    enableInput(isEnabled) { // TODO : rename to enableInput and take args as isEnabled boolean
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) { // TODO : same
        this.input.priorityID = priorityID;
    }
}