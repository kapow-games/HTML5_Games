"use strict";

export default class BackButton extends Phaser.Button { // TODO : @mayank : 'use-strict' . Move Phaser classes to widgets package
    constructor(arg) { // TODO : formattting
        super(arg.game, arg.posX, arg.posY, arg.label, arg.callback);
        this.anchor.setTo(arg.anchorX, arg.anchorY);
    }

    enableInput(isEnabled) { // TODO : rename to enableInput and take args as isEnabled boolean
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) { // TODO : same
        this.input.priorityID = priorityID;
    }
}