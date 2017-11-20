import globalVariableInstance from './gameGlobalVariables';

export default class VsRandomGameButton extends Phaser.Button {
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

        super(_phaserGameObj, _posX, _posY, _label, () => this.vsRandomGameStart, () => this, _overFrame, _outFrame, _downFrame, _upFrame);

        this.anchor.setTo(_anchorX, _anchorY);
        this.inputEnabled = _inputEnabled;
    }

    vsRandomGameStart() {
        this.inputEnabled = false;
        globalVariableInstance.set("gameType", 'random');
        globalVariableInstance.set("randomRoom", true);
        console.log("Creating room for Random Game.");
        kapow.startGameWithRandomPlayers({'difficulty': 'medium'}, function (roomDetail) {
            console.log("Random Room Creation - Success.");
            globalVariableInstance.set("room", roomDetail);
            globalVariableInstance.set("playerMark", 1);
            globalVariableInstance.set("opponentMark", 2);
            parseRoomAndRedirectToGame();//TODO :  import from clientAPI.js
        }, function (error) {
            this.inputEnabled = true;
            console.log("Random Room Creation - Failure.", error);
        });
    }

}