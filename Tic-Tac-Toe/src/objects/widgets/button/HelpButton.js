'use strict';

import phaserManager from "../../../util/phaserManager";
import DarkOverlay from './DarkOverLay';

export default class HelpButton extends Phaser.Button {
    constructor(arg) {
        let helpButtonClickHandler = function () {
            this.darkOverlay = new DarkOverlay({
                game: this.game,
                posX: 0,
                posY: 0,
                label: 'darkOverlay',
                anchorX: 0,
                anchorY: 0,
                inputEnabled: true,
                clickHandler: this.cancelHelp.bind(this)
            });
            this.game.stage.addChild(this.darkOverlay);

            this.bg.enableInput(true);
            this.bg.setInputPriority(2);

            this.helpModal = this.game.add.sprite(540, 961.5, 'statsBackground');
            this.helpModal.inputEnabled = true;
            this.helpModal.input.priorityID = 3;
            this.helpModal.anchor.setTo(0.5);
            this.helpModal.scale.setTo(0);
            this.game.stage.addChild(this.helpModal);
            //Pop Up Animation
            this.popUpHelpModal = this.game.add.tween(this.helpModal.scale).to({x: 1, y: 1}, 600, "Quart.easeOut");
            this.popUpHelpModal.start();

            this.popUpHelpModal.onComplete.add(function () {
                this.bg.setInputPriority(1);
                this.bg.enableInput(false);
                this.darkOverlay.setInputPriority(2);
                this.howToPlayText = phaserManager.createText(this.game, {
                    positionX: 319.5,
                    positionY: 465,
                    messageToDisplay: 'HOW TO PLAY', // TODO : Fix later : Move all the messages to a new Strings file constants
                    align: "center",
                    backgroundColor: "#fefefe",
                    fill: "#6d616d",
                    font: 'nunito-regular',
                    fontSize: "60px",
                    fontWeight: 800,
                    wordWrapWidth: 441
                });
                this.game.stage.addChild(this.howToPlayText);

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
                this.game.stage.addChild(this.vsFriendText);

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
                this.game.stage.addChild(this.vsRandomText);

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
                this.game.stage.addChild(this.helpTabView1Text);
            }.bind(this));
            console.log('Help Button Clicked');
        };

        super(arg.game, arg.posX, arg.posY, arg.label, helpButtonClickHandler, null);

        this.bg = arg.bg;
        this.game = arg.game;
        this.anchor.setTo(arg.anchorX, arg.anchorY);
    }

    enableInput(isEnabled) {
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) {
        this.input.priorityID = priorityID;
    }

    cancelHelp() {
        this.game.stage.removeChild(this.howToPlayText);
        this.game.stage.removeChild(this.vsFriendText);
        this.game.stage.removeChild(this.vsRandomText);
        this.game.stage.removeChild(this.helpTabView1Text);
        this.game.stage.removeChild(this.helpModal);
        this.game.stage.removeChild(this.darkOverlay);
    }
};