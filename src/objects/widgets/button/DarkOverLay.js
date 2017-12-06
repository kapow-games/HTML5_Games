"use strict";

export default class DarkOverLay extends Phaser.Button {
    constructor(arg) {
        if( !("clickHandler" in arg) ) { // TODO : not needed
            arg.clickHandler = null;
        }
        super(arg.game, arg.posX, arg.posY, arg.label, arg.clickHandler);
        this.anchor.setTo(arg.anchorX, arg.anchorY);
        this.inputEnabled = arg.inputEnabled;
    }

    destroyButton() {
        this.destroy();
    }

    enableInput(isEnabled) {
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) {
        this.input.priorityID = priorityID;
    }
}