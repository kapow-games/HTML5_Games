"use strict";

import gameInfo from '../../store/GameInfo';
import parseRoomAndRedirectToGame from "../../../util/roomRedirect";
import GAME_CONST from "../../../const/GAME_CONST";
import kapowClientController from "../../../kapow/KapowClientController";

export default class VsRandomGameButton extends Phaser.Button {
    constructor(arg) {
        let vsRandomGameStart = function () { // TODO : Same as OnGoingGameButton
            this.inputEnabled = false; // TODO : no this before super
            gameInfo.set("gameType", 'random');
            gameInfo.set("randomRoom", true);
            console.log("Creating room for Random Game.");
            kapowClientController.handleStartGameWithRandomPlayers({
                'difficulty': 'medium'
            }, function (room) {
                console.log("Random Room Creation - Success.");
                gameInfo.set("room", room);
                gameInfo.set("playerMark", GAME_CONST.TURN.X);
                gameInfo.set("opponentMark", GAME_CONST.TURN.O);
                parseRoomAndRedirectToGame();
            }, function (error) {
                this.inputEnabled = true;
                console.log("Random Room Creation - Failure.", error);
            }.bind(this));
        };

        super(arg.game, arg.posX, arg.posY, arg.label, vsRandomGameStart, null, arg.overFrame, arg.outFrame, arg.downFrame, arg.upFrame);

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