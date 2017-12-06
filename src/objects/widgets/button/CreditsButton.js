"use strict";

import DarkOverlay from './DarkOverLay';
import phaserManager from '../../../util/phaserManager';

export default class CreditsButton extends Phaser.Button {
    constructor(arg) {
        let creditsButtonClickHandler = function () {
            console.log('Credits Button Clicked.');
            this.darkOverlay = new DarkOverlay({
                game: this.game,
                posX: 0,
                posY: 0,
                label: 'darkOverlay',
                anchorX: 0,
                anchorY: 0,
                inputEnabled: true,
                clickHandler: this.cancelCredits.bind(this)
            });
            this.game.stage.addChild(this.darkOverlay);
            this.bg.enableInput(true);
            this.bg.setInputPriority(2);
            this.createCreditsModal();
        };
        super(arg.game, arg.posX, arg.posY, arg.label, creditsButtonClickHandler, null);
        this.bg = arg.bg;
        this.game = arg.game;
        this.anchor.setTo(arg.anchorX, arg.anchorY);
    }

    createCreditsModal() {
        this.creditsModal = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'creditsModal');
        this.creditsModal.inputEnabled = true;
        this.creditsModal.input.priorityID = 3;
        this.creditsModal.anchor.setTo(0.5);
        this.game.stage.addChild(this.creditsModal);
        this.creditsModal.scale.setTo(0);
        this.popUpCreditsModal = this.game.add.tween(this.creditsModal.scale).to({x: 1, y: 1}, 600, "Quart.easeOut");
        this.popUpCreditsModal.start();

        this.fillCredits();
    }

    fillCredits() {
        this.popUpCreditsModal.onComplete.add(function () {
            this.bg.setInputPriority(1);
            this.bg.enableInput(false);
            this.darkOverlay.setInputPriority(2);

            this.creditsLogo = this.game.add.sprite(360, 603, 'creditsLogo');
            this.game.stage.addChild(this.creditsLogo);

            this.musicCreditsText = phaserManager.createText(this.game, {
                positionX: 306.5,
                positionY: 1011,
                message: 'MUSIC CREDITS', // TODO : rename to displayMessage or just message/text ?
                align: "center",
                backgroundColor: "#fefefe",
                fill: "#6d616d",
                font: 'nunito-regular',
                fontSize: "60px",
                fontWeight: 800,
                wordWrapWidth: 467
            });
            this.game.stage.addChild(this.musicCreditsText);

            this.cancelButton = this.game.add.button(864, 603, 'statsClose', this.cancelCredits, this);
            this.cancelButton.inputEnabled = true;
            this.cancelButton.input.priorityID = 4;
            this.game.stage.addChild(this.cancelButton);


            this.creditsText = phaserManager.createText(this.game, {
                positionX: this.game.world.centerX,
                positionY: 1207.5,
                anchorX: 0.5,
                anchorY: 0.5,
                message: "Robobozo by Kevin MacLeod\nTaDa! by jimhancock\nTap1 by Whatthes",
                align: "center",
                backgroundColor: "#fefefe",
                fill: "#7a797a",
                font: 'nunito-regular',
                fontSize: "45px",
                fontWeight: 600,
                wordWrapWidth: 792
            });
            this.game.stage.addChild(this.creditsText);
        }.bind(this));
    }

    cancelCredits() {
        this.game.stage.removeChild(this.creditsLogo);
        this.game.stage.removeChild(this.cancelButton);
        this.game.stage.removeChild(this.creditsModal);
        this.game.stage.removeChild(this.darkOverlay);
        this.game.stage.removeChild(this.musicCreditsText);
        this.game.stage.removeChild(this.creditsText);
    }

};