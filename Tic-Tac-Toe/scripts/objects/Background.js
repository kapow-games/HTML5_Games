export default class Background extends Phaser.Sprite {
    constructor(obj) {
        let _phaserGameObj = obj.phaserGameObj; // TODO @mayank: same
        let _posX = obj.posX;
        let _posY = obj.posY;
        let _label = obj.label;
        let _anchorX = obj.anchorX;
        let _anchorY = obj.anchorY;

        super(_phaserGameObj, _posX, _posY, _label);

        this.anchor.setTo(_anchorX, _anchorY);
    }
    setInputEnabled(val) {
        this.inputEnabled = val;
    }
    setInputPriority(val) { // TODO : Same
        this.input.priorityID = val;
    }
}