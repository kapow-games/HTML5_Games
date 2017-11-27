import gameInfo from '../../store/GameGlobalVariables';
import parseRoomAndRedirectToGame from "../../../util/parseRoomAndRedirectToGame";
import gameConst from "../../../gameParam/gameConst";

export default class VsFriendGameButton extends Phaser.Button {
    constructor(arg) {
        let vsFriendGameStart = function () {
            gameInfo.set("gameType", 'friend');
            kapow.startGameWithFriends(2, 2, function (roomDetail) {
                gameInfo.set("room", roomDetail);
                gameInfo.set("playerMark", gameConst.X);
                gameInfo.set("opponentMark", gameConst.O);
                parseRoomAndRedirectToGame();
            }, function (error) {
                console.log("startvsFriendGame Failed : ", error);
            });
        };
        super(arg.game, arg.posX, arg.posY, arg.label, vsFriendGameStart, null, arg.overFrame, arg.outFrame, arg.downFrame, arg.upFrame);
        this.anchor.setTo(arg.anchorX, arg.anchorY);
        this.inputEnabled = arg.inputEnabled;
    }

    enableInput(isEnabled) {
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) {
        this.input.priorityID = priorityID;
    }

};