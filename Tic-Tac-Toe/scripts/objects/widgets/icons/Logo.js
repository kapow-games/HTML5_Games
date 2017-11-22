"use strict";
export default class Logo extends Phaser.Sprite {
    constructor(obj) {
        super(obj.phaserGameObj, obj.posX, obj.posY, obj.label);
        this.anchor.setTo(obj.anchorX, obj.anchorY);
    }
}