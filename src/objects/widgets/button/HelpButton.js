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
                inputEnabled: true
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
                    positionY: 498,
                    message: 'HOW-TO-PLAY',
                    align: "center",
                    backgroundColor: "#fefefe",
                    fill: "#6d616d",
                    font: 'nunito-regular',
                    fontSize: "60px",
                    fontWeight: 800,
                    wordWrapWidth: 441
                });
                this.game.stage.addChild(this.howToPlayText);

                this.placeMark = phaserManager.createText(this.game, {
                    positionX: this.game.world.centerX,
                    positionY: 1362,
                    message: 'Tap on a square to place your mark',
                    align: "center",
                    backgroundColor: "#fefefe",
                    fill: "#7a797a",
                    font: 'nunito-regular',
                    fontSize: "45px",
                    fontWeight: 600,
                    wordWrapWidth: 792
                });
                this.placeMark.anchor.setTo(0.5,0);
                this.game.stage.addChild(this.placeMark);
                // this.placeMark.kill();

                this.winCondition = phaserManager.createText(this.game, {
                    positionX: this.game.world.centerX,
                    positionY: 1362,
                    message: '3-in-a-row wins',
                    align: "center",
                    backgroundColor: "#fefefe",
                    fill: "#7a797a",
                    font: 'nunito-regular',
                    fontSize: "45px",
                    fontWeight: 600,
                    wordWrapWidth: 792
                });
                this.winCondition.anchor.setTo(0.5,0);
                this.game.stage.addChild(this.winCondition);
                this.winCondition.kill();

                this.helpClose = this.game.add.button(864, 498, "helpClose", this.cancelHelp, this);
                this.helpClose.inputEnabled = true;
                this.helpClose.input.priorityID = 4;
                this.game.stage.addChild(this.helpClose);

                this.helpIcon = this.game.add.sprite(145.5, 627, "howToPlay");
                this.game.stage.addChild(this.helpIcon);
                let mask = this.game.add.graphics(0, 0);
                mask.beginFill(0xffffff);
                mask.anchor.setTo(0.5);
                mask.drawRect(145.5, 627, 788, 627);
                this.helpIcon.mask = mask;
                this.game.stage.addChild(mask);
                this.helpIconIndex = 1;


                this.helpDotPlaceMark = this.game.add.sprite(504, 1284, "bubbleDot");
                this.game.stage.addChild(this.helpDotPlaceMark);

                this.helpDotWin = this.game.add.sprite(552, 1284, "bubbleDot");
                this.game.stage.addChild(this.helpDotWin);
                this.helpDotWin.scale.setTo(2.0/3);


                this.helpIconSwipeToPlaceMark = this.game.add.tween(this.helpIcon).to({x: 145.5}, 600, "Quart.easeOut");
                this.helpIconSwipeToWin = this.game.add.tween(this.helpIcon).to({x: -642.5}, 600, "Quart.easeOut");
                this.expandHelpDotPlaceMark = this.game.add.tween(this.helpDotPlaceMark.scale).to({x: 1, y: 1}, 600, "Quart.easeOut");
                this.shrinkHelpDotPlaceMark = this.game.add.tween(this.helpDotPlaceMark.scale).to({x: 2.0/3, y: 2.0/3}, 600, "Quart.easeOut");
                this.expandHelpDotWin = this.game.add.tween(this.helpDotWin.scale).to({x: 1, y: 1}, 600, "Quart.easeOut");
                this.shrinkHelpDotWin = this.game.add.tween(this.helpDotWin.scale).to({x: 2.0/3, y: 2.0/3}, 600, "Quart.easeOut");

                this.tapStart = 0;
                this.tapEnd = 0;
                this.game.input.onDown.add(this.tap, this);
                this.game.input.onUp.add(this.release, this);
                // this.game.input.addMoveCallback(this.drag, this);
            }.bind(this));
            console.log('Help Button Clicked');
        };

        super(arg.game, arg.posX, arg.posY, arg.label, helpButtonClickHandler, null);

        this.bg = arg.bg;
        this.game = arg.game;
        this.anchor.setTo(arg.anchorX, arg.anchorY);
    }

    tap() {
        this.tapStart = this.game.input.x;
    }

    release() {
        this.tapEnd = this.game.input.x;
        if(this.tapEnd > this.tapStart) {
            if(this.helpIconIndex === 2) {
                this.helpIconSwipeToPlaceMark.start();
                this.expandHelpDotPlaceMark.start();
                this.shrinkHelpDotWin.start();
                this.helpIconIndex = 1;
                this.winCondition.kill();
                this.placeMark.reset(this.game.world.centerX, 1362);
            }
        }
        else if(this.tapEnd < this.tapStart) {
            if(this.helpIconIndex === 1) {
                this.helpIconSwipeToWin.start();
                this.shrinkHelpDotPlaceMark.start();
                this.expandHelpDotWin.start();
                this.helpIconIndex = 2;
                this.placeMark.kill();
                this.winCondition.reset(this.game.world.centerX, 1362);
            }
        }
    }

    enableInput(isEnabled) {
        this.inputEnabled = isEnabled;
    }

    setInputPriority(priorityID) {
        this.input.priorityID = priorityID;
    }

    cancelHelp() {
        this.game.stage.removeChild(this.howToPlayText);
        this.game.stage.removeChild(this.placeMark);
        this.game.stage.removeChild(this.winCondition);
        this.game.stage.removeChild(this.helpModal);
        this.game.stage.removeChild(this.darkOverlay);
        this.game.stage.removeChild(this.helpIcon);
        this.game.stage.removeChild(this.helpDotPlaceMark);
        this.game.stage.removeChild(this.helpDotWin);
        this.game.stage.removeChild(this.helpClose);
    }
};