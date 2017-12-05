'use strict'

import gameInfo from '../objects/store/GameInfo';
import BackButton from '../objects/widgets/button/BackButton';
import MusicButton from '../objects/widgets/button/MusicButton';
import Background from "../objects/widgets/icons/Background";
import GAME_CONST from "../const/GAME_CONST";

export class Select extends Phaser.State {
    preload() {
        console.log("Select state starting.");
        this.mark = 0;
        this.startButtonFlag = true;
        gameInfo.set("screenState", 3);
    }

    create() {
        this.createBackground();
        this.createMarkSelectLayout();
        this.createStartGameButton();
        this.createBackButton();
        this.createMusicButton();
        console.log(this.game);
        gameInfo.set("screenState", 0);
    }

    update() {
        if (this.mark !== 0) {
            // console.log("Mark Selection Done");
            this.startButtonDisabled.destroy();
            if (this.startButtonFlag === true) {
                this.startButton.inputEnabled = true;
                this.startButtonFlag = false;
            }
            gameInfo.set("playerMark", this.mark);
        }
    }

    shutdown() {
        this.game.stage.removeChild(this.bg);
        this.game.stage.removeChild(this.markSelectedX);
        this.game.stage.removeChild(this.markBackground);
        this.game.stage.removeChild(this.markSelectedO);
        this.game.stage.removeChild(this.xMark);
        this.game.stage.removeChild(this.oMark);
        this.game.stage.removeChild(this.startButtonDisabled);
        this.game.stage.removeChild(this.startButton);
        this.game.stage.removeChild(this.backButton);
    }

    startGame() {
        this.startButton.inputEnabled = false;
        kapow.startSoloGame(function (roomDetail) {
            gameInfo.set("room", roomDetail);
            gameInfo.set("gameType", "solo");
            this.game.state.start('PlayLoad');
        }.bind(this), function (error) {
            console.log("startSoloGame Failed : ", error);
        });
    }

    createBackground() {
        this.bg = new Background({
            game: this.game,
            posX: 0,
            posY: 0,
            label: 'arena',
            anchorX: 0,
            anchorY: 0
        });
        this.game.stage.addChild(this.bg);
    }

    createMarkSelectLayout() {
        this.markBackground = this.game.add.image(225, 663, 'choose_bg_mark');
        this.markBackground.anchor.setTo(0, 0);
        this.game.stage.addChild(this.markBackground);

        this.markSelectedX = this.game.add.image(249, 756, 'mark_selected');
        this.markSelectedX.anchor.setTo(0, 0);
        this.markSelectedX.alpha = 0;
        this.game.stage.addChild(this.markSelectedX);

        this.markSelectedO = this.game.add.image(561, 756, 'mark_selected');
        this.markSelectedO.anchor.setTo(0, 0);
        this.markSelectedO.alpha = 0;
        this.game.stage.addChild(this.markSelectedO);


        this.xMark = this.game.add.button(249, 756, 'cell', this.selectMarkX, this, 1, 1, 1);
        this.xMark.anchor.setTo(0, 0);
        this.game.stage.addChild(this.xMark);

        this.oMark = this.game.add.button(561, 756, 'cell', this.selectMarkO, this, 2, 2, 2);
        this.oMark.anchor.setTo(0, 0);
        this.game.stage.addChild(this.oMark);

    }

    selectMarkX() {
        console.log('X');
        this.markSelectedX.alpha = 1;
        this.markSelectedO.alpha = 0;
        this.mark = GAME_CONST.TURN.X;
    }

    selectMarkO() {
        console.log('O');
        this.markSelectedO.alpha = 1;
        this.markSelectedX.alpha = 0;
        this.mark = GAME_CONST.TURN.O;
    }

    createStartGameButton() {
        this.startButton = this.game.add.button(225, 1122, 'startbutton', this.startGame, this, 1, 1, 2);
        this.startButton.anchor.setTo(0, 0);
        this.startButton.inputEnabled = false;
        this.game.stage.addChild(this.startButton);

        this.startButtonDisabled = this.game.add.image(225, 1122, 'startbutton_disabled', this);
        this.startButtonDisabled.anchor.setTo(0, 0);
        this.game.stage.addChild(this.startButtonDisabled);
    }

    createBackButton() {
        this.backButton = new BackButton({
            game: this.game,
            posX: 48,
            posY: 96,
            label: 'back',
            anchorX: 0,
            anchorY: 0,
            callback: this.backButtonHandler.bind(this)
        });
        this.game.stage.addChild(this.backButton);
    }

    backButtonHandler() {
        console.log('back Button Pressed.');
        this.game.state.start('Menu');
    }

    createMusicButton() {
        this.musicButton = new MusicButton({
            game: this.game,
            posX: 960,
            posY: 96,
            label: 'music',
            anchorX: 0,
            anchorY: 0,
        });
        this.game.stage.addChild(this.musicButton);
    }
}