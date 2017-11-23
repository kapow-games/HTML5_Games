"use strict";

export default class OnGoingGameButton extends Phaser.Button {
    constructor(obj) {
        super(obj.game, obj.posX, obj.posY, obj.label, () => this.onGoingGameHandler, () => this, obj.overFrame, obj.outFrame, obj.downFrame, obj.upFrame);
        this.anchor.setTo(obj.anchorX, obj.anchorY);
    }

    onGoingGameHandler() {
        console.log('Active games layout requested');
        kapow.displayActiveRooms();
    }
}