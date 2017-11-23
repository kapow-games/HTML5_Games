export default class BackButton extends Phaser.Button { // TODO : @mayank : 'use-strict' . Move Phaser classes to widgets package
    constructor(obj) { // TODO : formattting
        let _phaserGameObj = obj.phaserGameObj; //  TODO : redundant vars
        let _posX = obj.posX;
        let _posY = obj.posY;
        let _label = obj.label;
        let _anchorX = obj.anchorX;
        let _anchorY = obj.anchorY;
        let _callback = obj.callback;

        super(_phaserGameObj, _posX, _posY, _label, _callback);

        this.anchor.setTo(_anchorX, _anchorY);
    }
    setInputPriority(val) { // TODO : use .input.disable ? much cleaner
        this.input.priorityID = val;
    }
}