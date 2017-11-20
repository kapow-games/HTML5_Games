import phaserManager from "../util/phaserManager";
import DarkOverlay from './DarkOverLay';

export default class HelpButton extends Phaser.Button {
    constructor(obj) {
        let _phaserGameObj = obj.phaserGameObj;
        let _posX = obj.posX;
        let _posY = obj.posY;
        let _label = obj.label;
        let _anchorX = obj.anchorX;
        let _anchorY = obj.anchorY;

        super(_phaserGameObj, _posX, _posY, _label, () => this.clickHandler, () => this);

        this.bg = obj.bg;
        this.phaserGame = obj.phaserGameObj;
        this.anchor.setTo(_anchorX, _anchorY);
    }

    clickHandler() {
        this.darkOverlay = new DarkOverlay({
            phaserGameObj: this.game,
            posX: 0,
            posY: 0,
            label: 'darkOverlay',
            anchorX: 0,
            anchorY: 0,
            inputEnabled: true,
            clickHandler: this.cancelHelp
        });
        this.bg.inputEnabled = true;
        this.bg.input.priorityID = 2;

        this.helpModal = this.game.add.sprite(540, 961.5, 'statsBackground');
        this.helpModal.inputEnabled = true;
        this.helpModal.input.priorityID = 3;
        this.helpModal.anchor.setTo(0.5);
        this.helpModal.scale.setTo(0);
        this.popUpHelpModal = this.add.tween(this.helpModal.scale).to({x: 1, y: 1}, 600, "Quart.easeOut");
        this.popUpHelpModal.start();

        var self = this;
        this.popUpHelpModal.onComplete.add(function () {
            self.bg.setInputPriority(1);
            self.bg.setInputEnabled(false);
            self.darkOverlay.setInputPriority(2);

            self.howToPlayText = phaserManager.createText(self.game, {
                positionX: 319.5,
                positionY: 465,
                messageToDisplay: 'HOW TO PLAY',
                align: "center",
                backgroundColor: "#fefefe",
                fill: "#6d616d",
                font: 'nunito-regular',
                fontSize: "60px",
                fontWeight: 800,
                wordWrapWidth: 441
            });

            self.vsFriendText = phaserManager.createText(self.game, {
                positionX: 468,
                positionY: 729,
                messageToDisplay: 'VS FRIEND',
                align: "center",
                backgroundColor: "#fefefe",
                fill: "#d8d8d8",
                font: 'nunito-regular',
                fontSize: "42px",
                fontWeight: 800,
                wordWrapWidth: 224
            });

            self.vsRandomText = phaserManager.createText(self.game, {
                positionX: 189,
                positionY: 909,
                messageToDisplay: 'RANDOM OPPONENT',
                align: "center",
                backgroundColor: "#fefefe",
                fill: "#d8d8d8",
                font: 'nunito-regular',
                fontSize: "42px",
                fontWeight: 800,
                wordWrapWidth: 453
            });

            self.helpTabView1Text = phaserManager.createText(self.game, {
                positionX: 222,
                positionY: 1284,
                messageToDisplay: 'Play with a friend, a random\nopponent or practice vs AI',
                align: "center",
                backgroundColor: "#fefefe",
                fill: "#7a797a",
                font: 'nunito-regular',
                fontSize: "42px",
                fontWeight: 800,
                wordWrapWidth: 636
            });
        });
        console.log('Help Button Clicked');
    }
    cancelHelp()
    {
        this.howToPlayText.destroy();
        this.vsFriendText.destroy();
        this.vsRandomText.destroy();
        this.helpTabView1Text.destroy();
        this.helpModal.destroy();
        this.darkOverlay.destroy();
    }
}