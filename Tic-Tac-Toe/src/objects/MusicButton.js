export default class MusicButton extends Phaser.Button {
    constructor(obj) {
        let _phaserGameObj = obj.phaserGameObj;
        let _posX = obj.posX;
        let _posY = obj.posY;
        let _label = obj.label;
        let _anchorX = obj.anchorX;
        let _anchorY = obj.anchorY;

        super(_phaserGameObj, _posX, _posY, _label, () => this.musicToggle, () => this);

        this.anchor.setTo(_anchorX, _anchorY);
    }
    musicToggle() {
        this.soundToggle.frame = (1 + this.soundToggle.frame) % 2;
    }
    setInputPriority(val) {
        this.input.priorityID = val;
    }
}