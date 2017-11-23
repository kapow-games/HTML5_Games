import {globalVariableInstance} from './gameGlobalVariables'

export default class VsFriendGameButton extends Phaser.Button {
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

        super(_phaserGameObj, _posX, _posY, _label, vsFriendGameStart, null, _overFrame, _outFrame, _downFrame, _upFrame);

        this.anchor.setTo(_anchorX, _anchorY);
        this.inputEnabled = _inputEnabled;
    }

    vsFriendGameStart() {
        globalVariableInstance.set("gameType", 'friend');
        kapow.startGameWithFriends(2, 2, function (roomDetail) {
            globalVariableInstance.set("room", roomDetail);
            globalVariableInstance.set("playerMark", 1);
            globalVariableInstance.set("opponentMark", 2);
            parseRoomAndRedirectToGame(); //TODO : import this function from clientAPI.js
        }, function (error) {
            console.log("startvsFriendGame Failed : ", error);
        });
    }

}