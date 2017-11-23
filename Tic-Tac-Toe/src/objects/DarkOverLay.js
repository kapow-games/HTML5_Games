export default class DarkOverLay extends Phaser.Button { // TODO : move to widgets , use-strict . Do it in all necessary files
    constructor(obj) {
        let _phaserGameObj = obj.phaserGameObj;
        let _posX = obj.posX;
        let _posY = obj.posY;
        let _label = obj.label;
        let _anchorX = obj.anchorX;
        let _anchorY = obj.anchorY;
        let _inputEnabled = obj.inputEnabled;

        super(_phaserGameObj, _posX, _posY, _label, obj.clickHandler);

        this.anchor.setTo(_anchorX, _anchorY); // TODO : rename it just x, y ?
        this.inputEnabled = _inputEnabled;
    }
    destroy() {
        this.destroy(); // TODO : do u want to call super.destory ? there is infinite recursion here
    }
    setInputEnabled(val) { // TODO : rename to enableInput and take args as isEnabled boolean
        this.inputEnabled = val;
    }
    setInputPriority(val){ // TODO : same
        this.input.priorityID = val;
    }
}