"use strict";

export default class MusicButton extends Phaser.Button {
    constructor(arg) {
        let musicToggle = function () {
            console.log("clickRegistered");
            this.frame = (1 + this.frame) % 2;
        };
        super(arg.game, arg.posX, arg.posY, arg.label, musicToggle, null);
        this.anchor.setTo(arg.anchorX, arg.anchorY);
    }

    enableInput(isEnabled) { // TODO : rename to enableInput and take args as isEnabled boolean
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) { // TODO : same
        this.input.priorityID = priorityID;
    }
};