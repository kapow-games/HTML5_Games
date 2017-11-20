export default class DarkOverLay extends Phaser.Button {
    constructor(obj) {
        let _phaserGameObj = obj.phaserGameObj;
        let _posX = obj.posX;
        let _posY = obj.posY;
        let _label = obj.label;
        let _anchorX = obj.anchorX;
        let _anchorY = obj.anchorY;
        let _inputEnabled = obj.inputEnabled;

        super(_phaserGameObj, _posX, _posY, _label, () => this.clickHandler, () => this);

        this.clickHandler = obj.clickHandler;
        this.anchor.setTo(_anchorX, _anchorY);
        this.inputEnabled = _inputEnabled;
    }
    destroy() {
        this.destroy();
    }
    setInputEnabled(val) {
        this.inputEnabled = val;
    }
    setInputPriority(val){
        this.input.priorityID = val;
    }
}