"use strict";

import gameInfo from '../../store/GameInfo';
import GamePlayUtil from "../../../util/GamePlayUtil";
import GAME_CONST from "../../../const/GAME_CONST";
import kapowClientController from "../../../kapow/KapowClientController";
import GameManager from "../../../controller/GameManager";

export default class VsRandomGameButton extends Phaser.Button {
    constructor(arg) {
        let vsRandomGameStart = function () {
            this.inputEnabled = false;
            GameManager.playTapSound();
            gameInfo.set("gameType", 'random');
            gameInfo.set("randomRoom", true);
            console.log("Creating room for Random Game.");
            kapowClientController.handleStartGameWithRandomPlayers({
                'difficulty': 'medium'
            }, function (room) {
                console.log("Random Room Creation - Success.");
                gameInfo.setBulk({
                    "room": room,
                    "playerMark": GAME_CONST.TURN.X,
                    "opponentMark": GAME_CONST.TURN.O,
                });
                GamePlayUtil.redirectToScreen();
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