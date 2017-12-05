"use strict";

import gameInfo from '../../store/GameInfoStore';
import parseRoomAndRedirectToGame from "../../../util/roomRedirect";
import GAME_CONST from "../../../gameParam/gameConst";


export default class VsRandomGameButton extends Phaser.Button {
    constructor(arg) {
        let vsRandomGameStart = function () {
            this.inputEnabled = false; // TODO : no this before super
            gameInfo.set("gameType", 'random');
            gameInfo.set("randomRoom", true);
            console.log("Creating room for Random Game.");
            kapow.startGameWithRandomPlayers({'difficulty': 'medium'}, function (roomDetail) {
                console.log("Random Room Creation - Success.");
                gameInfo.set("room", roomDetail);
                gameInfo.set("playerMark", GAME_CONST.X);
                gameInfo.set("opponentMark", GAME_CONST.O);
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