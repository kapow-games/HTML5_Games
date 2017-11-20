export default class Logo extends Phaser.Sprite {
    constructor(obj) {
        let _phaserGameObj = obj.phaserGameObj;
        let _posX = obj.posX;
        let _posY = obj.posY;
        let _label = obj.label;
        let _anchorX = obj.anchorX;
        let _anchorY = obj.anchorY;

        super(_phaserGameObj, _posX, _posY, _label);

        this.anchor.setTo(_anchorX, _anchorY);
    }

}