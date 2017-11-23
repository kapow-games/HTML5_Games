"use strict";

export default class BackButton extends Phaser.Button { // TODO : @mayank : 'use-strict' . Move Phaser classes to widgets package
    constructor(obj) { // TODO : formattting
        super(obj.game, obj.posX, obj.posY, obj.label, obj.callback);
        this.anchor.setTo(obj.anchorX, obj.anchorY);
    }

    enableInput(isEnabled) { // TODO : rename to enableInput and take args as isEnabled boolean
        this.inputEnabled = val;
    }

    setInputPriority(priorityID) { // TODO : same
        this.input.priorityID = priorityID;
    }
}