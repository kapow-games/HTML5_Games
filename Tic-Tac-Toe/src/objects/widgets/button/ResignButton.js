"use strict";

import gameLayoutVariables from "../../store/gameLayoutVariables";
import DarkOverlay from "./DarkOverLay";
import saveGameData from "../../../util/saveGameData";
import gameEndHandler from "../../../util/gameEnd";
import gameInfo from "../../store/GameInfoStore"
import GAME_CONST from "../../../gameParam/gameConst";

export default class ResignButton extends Phaser.Button {
    constructor(arg) {
        let resignClickHandler = function () {
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
        gameInfo.set("win", gameInfo.get("playerMark") === GAME_CONST.X ? 2 : 1);
        if (gameInfo.get("gameType") === "solo") {
            saveGameData(this.game, true);
            gameLayoutVariables.backgroundImage.enableInput(true);
            gameLayoutVariables.backgroundImage.setInputPriority(1);
            this.cancelResign();
            // let tempCells = this.game.state.states.Play.cells.children; // TODO : accidental global
            gameLayoutVariables.turnText.text = " YOU LOSE!";
            gameEndHandler(this.game, 1);
        }
        else if (gameInfo.get("gameType") === "friend") {
            kapow.invokeRPC("resignationRequest", {
                    board: gameInfo.get("boardStatus").cells,
                    playerTurn: gameInfo.get("playerData").id,
                    opponentTurn: gameInfo.get("opponentData").id,
                    roomID: gameInfo.get("room").roomId
                },
                function (obj) {
                    console.log("resignation - success : obj: \n", obj);
                    gameLayoutVariables.backgroundImage.enableInput(true);
                    gameLayoutVariables.backgroundImage.setInputPriority(1);
                    this.cancelResign();
                    gameLayoutVariables.turnText.text = " YOU LOSE!";
                    console.log("Client resigned, hence lost");
                    gameEndHandler(this.game, 1);
                }.bind(this),
                function (error) {
                    console.log("resignation - Failure due to following error : ", error);
                    this.cancelResign();
                }.bind(this)
            );
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
            clickHandler: this.cancelResign.bind(this)
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