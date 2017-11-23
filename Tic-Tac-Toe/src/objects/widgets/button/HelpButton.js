'use strict';

import phaserManager from "../../../util/phaserManager";
import DarkOverlay from './DarkOverLay';

export default class HelpButton extends Phaser.Button {
    constructor(obj) {
        super(obj.game, obj.posX, obj.posY, obj.label, () => this.clickHandler, () => this);

        this.bg = obj.bg;
        this.phaserGame = obj.game;
        this.anchor.setTo(obj.anchorX, obj.anchorY);
    }

    clickHandler() {
        this.darkOverlay = new DarkOverlay({
            game: this.game,
            posX: 0,
            posY: 0,
            label: 'darkOverlay',
            anchorX: 0,
            anchorY: 0,
            inputEnabled: true,
            clickHandler: this.cancelHelp
        });

        this.bg.enableInput(true);
        this.bg.setInputPriority(2);

        this.helpModal = this.game.add.sprite(540, 961.5, 'statsBackground');
        this.helpModal.inputEnabled = true;
        this.helpModal.input.priorityID = 3;
        this.helpModal.anchor.setTo(0.5);
        this.helpModal.scale.setTo(0);
        //Pop Up Animation
        this.popUpHelpModal = this.add.tween(this.helpModal.scale).to({x: 1, y: 1}, 600, "Quart.easeOut");
        this.popUpHelpModal.start();

        this.popUpHelpModal.onComplete.add(function () {
            this.bg.setInputPriority(1);
            this.bg.enableInput(false);
            this.darkOverlay.setInputPriority(2);
            this.howToPlayText = phaserManager.createText(this.game, {
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

            this.vsFriendText = phaserManager.createText(this.game, {
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

            this.vsRandomText = phaserManager.createText(this.game, {
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

            this.helpTabView1Text = phaserManager.createText(this.game, {
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
        }.bind(this));
        console.log('Help Button Clicked');
    }

    enableInput(isEnabled) { // TODO : rename to enableInput and take args as isEnabled boolean
        this.inputEnabled = val;
    }

    setInputPriority(priorityID) { // TODO : same
        this.input.priorityID = priorityID;
    }

    cancelHelp() {// TODO : formatting
        this.howToPlayText.destroy();
        this.vsFriendText.destroy();
        this.vsRandomText.destroy();
        this.helpTabView1Text.destroy();
        this.helpModal.destroy();
        this.darkOverlay.destroyButton();
    }
}