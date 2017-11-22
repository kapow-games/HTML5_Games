import gameLayoutVariables from "../../store/gameLayoutVariables";
import DarkOverlay from "./DarkOverLay";
import saveGameData from "../../../util/saveGameData";
import gameEndHandler from "../../../util/gameEnd";
import globalVariableInstance from "../../store/gameGlobalVariables"

export default class ResignButton extends Phaser.Button {
    constructor(obj) {
        super(obj.phaserGameObj, obj.posX, obj.posY, obj.label, () => this.resignClickHandler, () => this, obj.overFrame, obj.outFrame, obj.downFrame, obj.upFrame);
        this.phaserGame = obj.phaserGameObj;
        this.anchor.setTo(obj.anchorX, obj.anchorY);
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
            gameLayoutVariables.backgroundImage.enableInput(true);
            gameLayoutVariables.backgroundImage.setInputPriority(1);
            this.cancelResign();
            let tempCells = this.game.state.states.play.cells.children; // TODO : accidental global
            gameLayoutVariables.turnText.text = " YOU LOSE!";
            gameEndHandler(this.phaserGame, 1);
        }
        else if (globalVariableInstance.get("gameType") === "friend") {
            kapow.invokeRPC("resignationRequest", {
                    board: globalVariableInstance.get("boardStatus").cells,
                    playerTurn: globalVariableInstance.get("playerData").id,
                    opponentTurn: globalVariableInstance.get("opponentData").id,
                    roomID: globalVariableInstance.get("room").roomId
                },
                function (obj) {
                    console.log("resignation - success : obj: \n", obj);
                    gameLayoutVariables.backgroundImage.enableInput(true);
                    gameLayoutVariables.backgroundImage.setInputPriority(1);
                    this.cancelResign();
                    gameLayoutVariables.turnText.text = " YOU LOSE!";
                    console.log("Client resigned, hence lost");
                    gameEndHandler(this.phaserGame, 1);
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
        this.resignModal = this.phaserGame.add.sprite(72, 540, 'resignModal');
        this.resignModal.inputEnabled = true;
        this.resignModal.input.priorityID = 3;
    }

    createCancelButton() {
        this.cancelButton = this.phaserGame.add.button(291, 1191, 'cancel', this.cancelResign, this);
        this.cancelButton.inputEnabled = true;
        this.cancelButton.input.priorityID = 4;
    }

    createYesResignButton() {
        this.yesResignButton = this.phaserGame.add.button(522, 1191, 'yesResign', this.quitGame, this);
        this.yesResignButton.inputEnabled = true;
        this.yesResignButton.input.priorityID = 4;
    }

    enableInput(isEnabled) { // TODO : rename to enableInput and take args as isEnabled boolean
        this.inputEnabled = val;
    }

    setInputPriority(priorityID) { // TODO : same
        this.input.priorityID = priorityID;
    }
}