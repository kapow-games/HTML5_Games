"use strict";

import gameInfo from '../../store/GameInfo';
import parseRoomAndRedirectToGame from "../../../util/roomRedirect";
import GAME_CONST from "../../../const/GAME_CONST";
import kapowClientController from "../../../kapow/KapowClientController";

export default class VsFriendGameButton extends Phaser.Button {
    constructor(arg) {
        let vsFriendGameStart = function () { // TODO : Same as OnGoingGameButton
            gameInfo.set("gameType", 'friend');
            kapowClientController.handleStartGameWithFriends(2, 2, function (room) {
                gameInfo.set("room", room);
                gameInfo.set("playerMark", GAME_CONST.TURN.X);
                gameInfo.set("opponentMark", GAME_CONST.TURN.O);
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