"use strict";

export default class MusicButton extends Phaser.Button {
    constructor(obj) {
        super(obj.game, obj.posX, obj.posY, obj.label, () => this.musicToggle, () => this);
        this.anchor.setTo(obj.anchorX, obj.anchorY);
    }

    musicToggle() {
        this.soundToggle.frame = (1 + this.soundToggle.frame) % 2;
    }

    senableInput(isEnabled) { // TODO : rename to enableInput and take args as isEnabled boolean
        this.inputEnabled = val;
    }

    setInputPriority(priorityID) { // TODO : same
        this.input.priorityID = priorityID;
    }
}