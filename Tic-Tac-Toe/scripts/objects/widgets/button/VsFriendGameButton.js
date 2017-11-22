import globalVariableInstance from '../../store/gameGlobalVariables'
import parseRoomAndRedirectToGame from "../../../util/parseRoomAndRedirectToGame";

export default class VsFriendGameButton extends Phaser.Button {
    constructor(obj) {
        super(obj.phaserGameObj, obj.posX, obj.posY, obj.label, () => this.vsFriendGameStart, () => this, obj.overFrame, obj.outFrame, obj.downFrame, obj.upFrame);
        this.anchor.setTo(obj.anchorX, obj.anchorY);
        this.inputEnabled = obj.inputEnabled;
    }

    vsFriendGameStart() {
        globalVariableInstance.set("gameType", 'friend');
        kapow.startGameWithFriends(2, 2, function (roomDetail) {
            globalVariableInstance.set("room", roomDetail);
            globalVariableInstance.set("playerMark", 1);
            globalVariableInstance.set("opponentMark", 2);
            parseRoomAndRedirectToGame();
        }, function (error) {
            console.log("startvsFriendGame Failed : ", error);
        });
    }

    enableInput(isEnabled) { // TODO : rename to enableInput and take args as isEnabled boolean
        this.inputEnabled = val;
    }

    setInputPriority(priorityID) { // TODO : same
        this.input.priorityID = priorityID;
    }

}