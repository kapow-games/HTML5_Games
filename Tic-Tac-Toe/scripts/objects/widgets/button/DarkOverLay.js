"use strict";

export default class DarkOverLay extends Phaser.Button { // TODO : move to widgets , use-strict . Do it in all necessary files
    constructor(obj) {
        super(obj.game, obj.posX, obj.posY, obj.label, obj.clickHandler);
        this.anchor.setTo(obj.anchorX, obj.anchorY); // TODO : rename it just x, y ? // @sukhmeet : this was to make sure that positionX, positionY from anchorX, anchorY
        this.inputEnabled = obj.inputEnabled;
    }

    destroyButton() {
        this.destroy(); // TODO : do u want to call super.destory ? there is infinite recursion here
    }

    enableInput(isEnabled) { // TODO : rename to enableInput and take args as isEnabled boolean
        this.inputEnabled = val;
    }

    setInputPriority(priorityID) { // TODO : same
        this.input.priorityID = priorityID;
    }
}