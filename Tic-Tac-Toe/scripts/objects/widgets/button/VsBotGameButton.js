import globalVariableInstance from '../../store/gameGlobalVariables';

export default class VsBotGameButton extends Phaser.Button {
    constructor(obj) {
        super(obj.phaserGameObj, obj.posX, obj.posY, obj.label, () => this.vsBotGameStart, () => this, obj.overFrame, obj.outFrame, obj.downFrame, obj.upFrame);
        this.phaserGame = obj.phaserGameObj;
        this.anchor.setTo(obj.anchorX, obj.anchorY);
        this.inputEnabled = obj.inputEnabled;
    }

    vsBotGameStart() {
        globalVariableInstance.set("gameType", 'solo');
        this.phaserGame.state.start('select');
    }

    enableInput(isEnabled) { // TODO : rename to enableInput and take args as isEnabled boolean
        this.inputEnabled = val;
    }

    setInputPriority(priorityID) { // TODO : same
        this.input.priorityID = priorityID;
    }

}