export default class OnGoingGameButton extends Phaser.Button {
    constructor(obj) {

        let _phaserGameObj = obj.phaserGameObj;
        let _posX = obj.posX;
        let _posY = obj.posY;
        let _label = obj.label;
        let _anchorX = obj.anchorX;
        let _anchorY = obj.anchorY;
        let _overFrame = obj.overFrame;
        let _outFrame = obj.outFrame;
        let _downFrame = obj.downFrame;
        let _upFrame = obj.upFrame;

        super(_phaserGameObj, _posX, _posY, _label, () => this.onGoingGameHandler, () => this, _overFrame, _outFrame, _downFrame, _upFrame);
        this.anchor.setTo(_anchorX, _anchorY);

    }
    onGoingGameHandler() {
        console.log('Active games layout requested');
        kapow.displayActiveRooms();
    }

}