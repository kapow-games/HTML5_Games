"use strict";

export default class Logo extends Phaser.Sprite {
    constructor(arg) {
        super(arg.game, arg.posX, arg.posY, arg.label);
        this.anchor.setTo(arg.anchorX, arg.anchorY);
    }
}