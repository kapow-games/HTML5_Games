"use strict";

export default class StartNewGameBottomSlider extends Phaser.Sprite {
    constructor(arg) {
        super(arg.game, arg.posX, arg.posY, arg.label, arg.frame);
        this.anchor.setTo(arg.anchorX, arg.anchorY);
        this.frame = arg.frame;
    }
}