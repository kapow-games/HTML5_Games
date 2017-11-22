"use strict";

export default class StartNewGameBottomSlider extends Phaser.Sprite {
    constructor(obj) {
        super(obj.phaserGameObj, obj.posX, obj.posY, obj.label);
        this.anchor.setTo(obj.anchorX, obj.anchorY);
        this.frame = obj.frame;
    }

    setFrame(frame) {
        this.frame = frame;
    }
}