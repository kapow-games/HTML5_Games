import globalVariableInstance from '../../store/gameGlobalVariables'
import parseRoomAndRedirectToGame from "../../../util/parseRoomAndRedirectToGame";

export default class VsFriendGameButton extends Phaser.Button {
    constructor(arg) {
        let vsFriendGameStart = function () {
            globalVariableInstance.set("gameType", 'friend');
            kapow.startGameWithFriends(2, 2, function (roomDetail) {
                globalVariableInstance.set("room", roomDetail);
                globalVariableInstance.set("playerMark", 1);
                globalVariableInstance.set("opponentMark", 2);
                parseRoomAndRedirectToGame();
            }, function (error) {
                console.log("startvsFriendGame Failed : ", error);
            });
        };
        super(arg.game, arg.posX, arg.posY, arg.label, vsFriendGameStart, null, arg.overFrame, arg.outFrame, arg.downFrame, arg.upFrame);
        this.anchor.setTo(arg.anchorX, arg.anchorY);
        this.inputEnabled = arg.inputEnabled;
    }

    enableInput(isEnabled) { // TODO : rename to enableInput and take args as isEnabled boolean
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) { // TODO : same
        this.input.priorityID = priorityID;
    }

};