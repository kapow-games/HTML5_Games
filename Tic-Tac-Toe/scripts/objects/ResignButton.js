import {gameLayoutVariables} from "./gameLayoutVariables";
import DarkOverlay from "../objects/DarkOverLay";
import saveGameData from "../util/saveGameData";
import {gameEndHandler} from "../util/gameEnd";

export default class ResignButton extends Phaser.Button {
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

        super(_phaserGameObj, _posX, _posY, _label, () => this.resignClickHandler, () => this, _overFrame, _outFrame, _downFrame, _upFrame);
        this.phaserGame = _phaserGameObj;
        this.anchor.setTo(_anchorX, _anchorY);
    }

    resignClickHandler() {
        this.createDarkOverlay();
        this.createResignModal();
        this.createCancelButton();
        this.createYesResignButton();
    }

    cancelResign() {
        this.yesResignButton.destroy();
        this.cancelButton.destroy();
        this.resignModal.destroy();
        this.darkOverlay.destroy();
    }

    quitGame() {
        globalVariableInstance.set("win", globalVariableInstance.get("playerMark") === 1 ? 2 : 1);
        if (globalVariableInstance.get("gameType") === "solo") {
            saveGameData(this.phaserGame, true);
            gameLayoutVariables.backgroundImage.inputEnabled = true;
            gameLayoutVariables.backgroundImage.input.priorityID = 1;
            this.cancelResign();
            tempCells = this.game.state.states.play.cells.children;
            gameLayoutVariables.turnText.text = " YOU LOSE!";
            gameEndHandler(this.phaserGame, 1);
        }
        else if (globalVariableInstance.get("gameType") === "friend") {
            var that = this;
            kapow.invokeRPC("resignationRequest", {
                    board: globalVariableInstance.get("boardStatus").cells,
                    playerTurn: globalVariableInstance.get("playerData").id,
                    opponentTurn: globalVariableInstance.get("opponentData").id,
                    roomID: globalVariableInstance.get("room").roomId
                },
                function (obj) {
                    console.log("resignation - success : obj: \n", obj);
                    gameLayoutVariables.backgroundImage.inputEnabled = true;
                    gameLayoutVariables.backgroundImage.input.priorityID = 1;
                    that.cancelResign();
                    gameLayoutVariables.turnText.text = " YOU LOSE!";
                    console.log("Client resigned, hence lost");
                    gameEndHandler(that.phaserGame, 1);
                },
                function (error) {
                    console.log("resignation - Failure due to following error : ", error);
                    that.cancelResign();
                }
            );
        }
    }
    createDarkOverlay() {
        this.darkOverlay = new DarkOverlay({
            phaserGameObj: this.phaserGame,
            posX: 0,
            posY: 0,
            label: 'darkOverlay',
            anchorX: 0,
            anchorY: 0,
            inputEnabled: true,
            clickHandler: this.cancelResign.bind(this)
        });
        this.darkOverlay.setInputPriority(2);
    }
    createResignModal() {
        this.resignModal = this.game.add.sprite(72, 540, 'resignModal');
        this.resignModal.inputEnabled = true;
        this.resignModal.input.priorityID = 3;
    }
    createCancelButton() {
        this.cancelButton = this.game.add.button(291, 1191, 'cancel', this.cancelResign, this);
        this.cancelButton.inputEnabled = true;
        this.cancelButton.input.priorityID = 4;
    }
    createYesResignButton() {
        this.yesResignButton = this.game.add.button(522, 1191, 'yesResign', this.quitGame, this);
        this.yesResignButton.inputEnabled = true;
        this.yesResignButton.input.priorityID = 4;
    }
    setInputPriority(val) {
        this.input.priorityID = val;
    }
}