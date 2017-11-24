import globalVariableInstance from '../../store/gameGlobalVariables';
import parseRoomAndRedirectToGame from "../../../util/parseRoomAndRedirectToGame";

export default class VsRandomGameButton extends Phaser.Button {
    constructor(arg) {
        let vsRandomGameStart = function() {
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
            }.bind(this));
        };

        super(arg.game, arg.posX, arg.posY, arg.label, vsRandomGameStart, null, arg.overFrame, arg.outFrame, arg.downFrame, arg.upFrame);

        this.anchor.setTo(arg.anchorX, arg.anchorY);
        this.inputEnabled = arg.inputEnabled;
    }

    enableInput(isEnabled) { // TODO : rename to enableInput and take args as isEnabled boolean
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) { // TODO : same
        this.input.priorityID = priorityID;
    }
};