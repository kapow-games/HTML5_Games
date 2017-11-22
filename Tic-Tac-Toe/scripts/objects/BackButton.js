export default class BackButton extends Phaser.Button {
    constructor(obj) {
        let _phaserGameObj = obj.phaserGameObj;
        let _posX = obj.posX;
        let _posY = obj.posY;
        let _label = obj.label;
        let _anchorX = obj.anchorX;
        let _anchorY = obj.anchorY;
        let _callback = obj.callback;

        super(_phaserGameObj, _posX, _posY, _label, _callback);

        this.anchor.setTo(_anchorX, _anchorY);
    }
    setInputPriority(val) {
        this.input.priorityID = val;
    }
}