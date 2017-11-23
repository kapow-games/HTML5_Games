'use strict'
import globalVariableInstance from '../objects/gameGlobalVariables';
import BackButton from '../objects/BackButton';
import MusicButton from '../objects/MusicButton';
import Background from "../objects/Background";

export class Select extends Phaser.State {
    preload() {
        this.mark = 0;
        this.startButtonFlag = true;
        globalVariableInstance.set("screenState", 0);
    }

    create() {

        this.createBackground();
        this.createMarkSelectLayout();
        this.createStartGameButton();
        this.createBackButton();
        this.createMusicButton();

        globalVariableInstance.set("screenState", 0);
    }

    update() {
        if (this.mark !== 0) {
            // console.log("Mark Selection Done");
            this.startButtonDisabled.destroy();
            if (this.startButtonFlag === true) {
                this.startButton.inputEnabled = true;
                this.startButtonFlag = false;
            }
            globalVariableInstance.set("playerMark", this.mark);
        }
    }

    startGame() {
        this.startButton.inputEnabled = false;
        kapow.startSoloGame(function (roomDetail) {
            globalVariableInstance.set("room", roomDetail);
            globalVariableInstance.set("gameType", "solo");
            this.game.state.start('playLoad');
        }, function (error) {
            console.log("startSoloGame Failed : ", error);
        });
    }

    createBackground() {
        this.bg = new Background({
            phaserGameObj: this.game,
            posX: 0,
            posY: 0,
            label: 'arena',
            anchorX: 0,
            anchorY: 0
        });
    }

    createMarkSelectLayout() {
        this.markBackground = this.game.add.image(225, 663, 'choose_bg_mark');
        this.markBackground.anchor.setTo(0, 0);

        this.markSelectedX = this.game.add.image(249, 756, 'mark_selected');
        this.markSelectedX.anchor.setTo(0, 0);
        this.markSelectedX.alpha = 0;

        this.markSelectedO = this.game.add.image(561, 756, 'mark_selected');
        this.markSelectedO.anchor.setTo(0, 0);
        this.markSelectedO.alpha = 0;


        this.xMark = this.game.add.button(249, 756, 'cell', this.selectMarkX, this, 1, 1, 1);
        this.xMark.anchor.setTo(0, 0);

        this.oMark = this.game.add.button(561, 756, 'cell', this.selectMarkO, this, 2, 2, 2);
        this.oMark.anchor.setTo(0, 0);

    }

    selectMarkX() {
        console.log('X');
        this.markSelectedX.alpha = 1;
        this.markSelectedO.alpha = 0;
        this.mark = 1;
    }

    selectMarkO() {
        console.log('O');
        this.markSelectedO.alpha = 1;
        this.markSelectedX.alpha = 0;
        this.mark = 2;
    }

    createStartGameButton() {
        this.startButton = this.game.add.button(225, 1122, 'startbutton', this.startGame, this, 1, 1, 2);
        this.startButton.anchor.setTo(0, 0);
        this.startButton.inputEnabled = false;

        this.startButtonDisabled = this.game.add.image(225, 1122, 'startbutton_disabled', this);
        this.startButtonDisabled.anchor.setTo(0, 0);
    }

    createBackButton() {
        this.backButton = new BackButton({
            phaserGameObj: this.game,
            posX: 48,
            posY: 96,
            label: 'back',
            anchorX: 0,
            anchorY: 0,
            callback: this.backButtonHandler.bind(this)
        });
    }

    backButtonHandler() {
        console.log('back Button Pressed.');
        this.game.state.start('menu');
    }

    createMusicButton() {
        this.musicButton = new MusicButton({
            phaserGameObj: this.game,
            posX: 960,
            posY: 96,
            label: 'music',
            anchorX: 0,
            anchorY: 0,
        });
    }
}