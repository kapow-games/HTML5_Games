export default class LeaderboardButton extends Phaser.Button {
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
        let _inputEnabled = obj.inputEnabled;

        super(_phaserGameObj, _posX, _posY, _label, () => this.clickHandler, () => this, _overFrame, _outFrame, _downFrame, _upFrame);

        this.anchor.setTo(_anchorX, _anchorY);
        this.inputEnabled = _inputEnabled;
    }

    clickHandler() {
        console.log('Leaderboard Button Clicked');
        kapow.boards.displayScoreboard({'metric': 'points', 'interval': 'alltime'});
    }

}