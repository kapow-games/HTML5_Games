"use strict";

import layoutStore from "../../store/LayoutStore";
import DarkOverlay from "./DarkOverLay";
import GamePlayUtil from "../../../util/GamePlayUtil";
import gameInfo from "../../store/GameInfo"
import GAME_CONST from "../../../const/GAME_CONST";
import GameManager from "../../../controller/GameManager";
import kapowClientController from "../../../kapow/KapowClientController";

export default class ResignButton extends Phaser.Button {
    constructor(arg) {
        let resignClickHandler = function () {
            GameManager.playTapSound();
            this.createDarkOverlay();
            this.createResignModal();
            this.createCancelButton();
            this.createYesResignButton();
        };

        super(arg.game, arg.posX, arg.posY, arg.label, resignClickHandler, null, arg.overFrame, arg.outFrame, arg.downFrame, arg.upFrame);
        this.game = arg.game;
        this.anchor.setTo(arg.anchorX, arg.anchorY);
    }

    cancelResign() {
        this.game.stage.removeChild(this.yesResignButton);
        this.game.stage.removeChild(this.cancelButton);
        this.game.stage.removeChild(this.resignModal);
        this.game.stage.removeChild(this.darkOverlay);
    }

    quitGame() {
        gameInfo.set("win", gameInfo.get("playerMark") === GAME_CONST.TURN.X ? 2 : 1);
        if (gameInfo.get("gameType") === "solo") {
            GamePlayUtil.saveGameData(this.game.state.states.Play.cells.children, true);
            layoutStore.backgroundImage.enableInput(true);
            layoutStore.backgroundImage.setInputPriority(1);
            this.cancelResign();
            layoutStore.turnText.text = "YOU LOSE!";
            GameManager.endGame(1);
        }
        else if (gameInfo.get("gameType") === "friend") {
            kapowClientController.handleInvokeRPC("resignationRequest", {
                    board: gameInfo.get("boardStatus").cells,
                    playerTurn: gameInfo.get("playerData").id,
                    opponentTurn: gameInfo.get("opponentData").id,
                    roomID: gameInfo.get("room").roomId
                }, false,
                function (obj) {
                    console.log("resignation - success : obj: \n", obj);
                    layoutStore.backgroundImage.enableInput(true);
                    layoutStore.backgroundImage.setInputPriority(1);
                    this.cancelResign();
                    layoutStore.turnText.text = "YOU LOSE!";
                    console.log("Client resigned, hence lost");
                    GameManager.endGame(1);
                }.bind(this),
                function (error) {
                    console.log("resignation - Failure due to following error : ", error);
                    this.cancelResign();
                }.bind(this)
            );
            // TODO : avoid using kapow here. Pass a success(Yes) and cancel(NO) callback
        }
    }

    createDarkOverlay() {
        this.darkOverlay = new DarkOverlay({
            game: this.game,
            posX: 0,
            posY: 0,
            label: 'darkOverlay',
            anchorX: 0,
            anchorY: 0,
            inputEnabled: true,
            callback: this.cancelResign.bind(this)
        });
        this.darkOverlay.setInputPriority(2);
        this.game.stage.addChild(this.darkOverlay);
    }

    createResignModal() {
        this.resignModal = this.game.add.sprite(72, 540, 'resignModal');
        this.resignModal.inputEnabled = true;
        this.resignModal.input.priorityID = 3;
        this.game.stage.addChild(this.resignModal);
    }

    createCancelButton() {
        this.cancelButton = this.game.add.button(291, 1191, 'cancel', this.cancelResign, this);
        this.cancelButton.inputEnabled = true;
        this.cancelButton.input.priorityID = 4;
        this.game.stage.addChild(this.cancelButton);
    }

    createYesResignButton() {
        this.yesResignButton = this.game.add.button(522, 1191, 'yesResign', this.quitGame, this);
        this.yesResignButton.inputEnabled = true;
        this.yesResignButton.input.priorityID = 4;
        this.game.stage.addChild(this.yesResignButton);
    }

    enableInput(isEnabled) {
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) {
        this.input.priorityID = priorityID;
    }
};