"use strict";

import kapowClientController from "../../../kapow/KapowClientController";
import GameManager from "../../../controller/GameManager";

export default class OnGoingGameButton extends Phaser.Button {
    constructor(arg) {
        let onGoingGameHandler = function () {
            console.log('Active games layout requested');
            GameManager.playTapSound();
            kapowClientController.handleDisplayActiveRooms();
        };
        super(arg.game, arg.posX, arg.posY, arg.label, onGoingGameHandler, null, arg.overFrame, arg.outFrame, arg.downFrame, arg.upFrame);
        this.anchor.setTo(arg.anchorX, arg.anchorY);
    }
};