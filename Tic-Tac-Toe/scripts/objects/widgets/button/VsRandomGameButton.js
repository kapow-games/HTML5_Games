import globalVariableInstance from '../../store/gameGlobalVariables';
import parseRoomAndRedirectToGame from "../../../util/parseRoomAndRedirectToGame";

export default class VsRandomGameButton extends Phaser.Button {
    constructor(obj) {
        super(obj.phaserGameObj, obj.posX, obj.posY, obj.label, () => this.vsRandomGameStart, () => this, obj.overFrame, obj.outFrame, obj.downFrame, obj.upFrame);

        this.anchor.setTo(obj.anchorX, obj.anchorY);
        this.inputEnabled = obj.inputEnabled;
    }

    vsRandomGameStart() {
        this.inputEnabled = false;
        globalVariableInstance.set("gameType", 'random');
        globalVariableInstance.set("randomRoom", true);
        console.log("Creating room for Random Game.");
        kapow.startGameWithRandomPlayers({'difficulty': 'medium'}, function (roomDetail) {
            console.log("Random Room Creation - Success.");
            globalVariableInstance.set("room", roomDetail);
            globalVariableInstance.set("playerMark", 1);
            globalVariableInstance.set("opponentMark", 2);
            parseRoomAndRedirectToGame();
        }, function (error) {
            this.inputEnabled = true;
            console.log("Random Room Creation - Failure.", error);
        });
    }

    enableInput(isEnabled) { // TODO : rename to enableInput and take args as isEnabled boolean
        this.inputEnabled = val;
    }

    setInputPriority(priorityID) { // TODO : same
        this.input.priorityID = priorityID;
    }
}