"use strict";

export default class MusicButton extends Phaser.Button {
    constructor(arg) {
        let musicToggle = function () {
            console.log("clickRegistered");
            this.frame = (1 + this.frame) % 2;
        };
        super(arg.game, arg.posX, arg.posY, arg.label, musicToggle, null);// TODO : make super as first line always. everything after that
        this.anchor.setTo(arg.anchorX, arg.anchorY);
    }

    enableInput(isEnabled) {
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) {
        this.input.priorityID = priorityID;
    }
};