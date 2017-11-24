import globalVariableInstance from '../../store/gameGlobalVariables';

export default class VsBotGameButton extends Phaser.Button {
    constructor(arg) {
        let vsBotGameStart = function() {
            globalVariableInstance.set("gameType", 'solo');
            this.game.state.start('select');
        };
        super(arg.game, arg.posX, arg.posY, arg.label, vsBotGameStart, null, arg.overFrame, arg.outFrame, arg.downFrame, arg.upFrame);
        this.game = arg.game;
        this.anchor.setTo(arg.anchorX, arg.anchorY);
        this.inputEnabled = arg.inputEnabled;
    }

    enableInput(isEnabled) { // TODO : rename to enableInput and take args as isEnabled boolean
        console.log("Enable input set to",this.inputEnabled);
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) { // TODO : same
        this.input.priorityID = priorityID;
    }

};