"use strict";

import DarkOverlay from './DarkOverLay';
import PhaserUtil from '../../../util/TextUtil';
import kapowGameStore from "../../store/KapowGameStore";
import GameManager from "../../../controller/GameManager";

export default class StatsButton extends Phaser.Button {
    constructor(arg) {
        let statButtonClickHandler = function () {
            GameManager.playTapSound();
            console.log('Stat Button Clicked.');
            this.darkOverlay = new DarkOverlay({
                game: this.game,
                posX: 0,
                posY: 0,
                label: 'darkOverlay',
                anchorX: 0,
                anchorY: 0,
                inputEnabled: true,
                callback: this.cancelStats.bind(this)
            });
            this.game.stage.addChild(this.darkOverlay);
            this.bg.enableInput(true);
            this.bg.setInputPriority(2);
            this.createStatsModal();
        };
        super(arg.game, arg.posX, arg.posY, arg.label, statButtonClickHandler, null, arg.overFrame, arg.outFrame, arg.downFrame, arg.upFrame);
        this.bg = arg.bg;
        this.game = arg.game;
        this.anchor.setTo(arg.anchorX, arg.anchorY);
    }

    createStatsModal() {
        this.statsModal = this.game.add.sprite(540, 961.5, 'statsBackground');
        this.statsModal.inputEnabled = true;
        this.statsModal.input.priorityID = 3;
        this.statsModal.anchor.setTo(0.5);
        this.game.stage.addChild(this.statsModal);
        this.statsModal.scale.setTo(0);
        this.popUpStatsModal = this.game.add.tween(this.statsModal.scale).to({x: 1, y: 1}, 600, "Quart.easeOut");
        this.popUpStatsModal.start();

        this.fillStatsValues();
    }

    fillStatsValues() {
        this.popUpStatsModal.onComplete.add(function () {
            this.bg.setInputPriority(1);
            this.bg.enableInput(false);
            this.darkOverlay.setInputPriority(2);

            this.statsLogo = this.game.add.sprite(360, 465, 'statsLogo');
            this.game.stage.addChild(this.statsLogo);

            this.myStatsText = PhaserUtil.createText(this.game, {
                positionX: 394.5,
                positionY: 848,
                message: 'MY STATS', // TODO : rename to displayMessage or just message/text ?
                align: "center",
                backgroundColor: "#fefefe",
                fill: "#6d616d",
                font: 'nunito-regular',
                fontSize: "60px",
                fontWeight: 800,
                wordWrapWidth: 291
            });
            this.game.stage.addChild(this.myStatsText);

            this.cancelButton = this.game.add.button(888, 441, 'statsClose', this.cancelStats, this);
            this.cancelButton.inputEnabled = true;
            this.cancelButton.input.priorityID = 4;
            this.game.stage.addChild(this.cancelButton);

            kapowGameStore.get("stats", function (statsValue, self) {
                console.log("gameStore fetch - Success.");
                if (statsValue) {
                    console.log("Value fetched from gameStore was : ", statsValue);
                    let valueJSON = JSON.parse(statsValue);
                    this.statsModeBackground = this.game.add.sprite(120, 978, 'modeBackground');
                    this.game.stage.addChild(this.statsModeBackground);
                    this.statsTotalBackground = this.game.add.sprite(120, 1362, 'statsTotalBackground');
                    this.game.stage.addChild(this.statsTotalBackground);
                    this.modeText = PhaserUtil.createText(this.game, {
                        positionX: 156,
                        positionY: 1002,
                        message: 'MODE',
                        align: "center",
                        backgroundColor: "#e2e6ff",
                        fill: "#9e7eff",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 109
                    });
                    this.game.stage.addChild(this.modeText);
                    this.playedText = PhaserUtil.createText(this.game, {
                        positionX: 414.5,
                        positionY: 1002,
                        message: 'PLAYED',
                        align: "center",
                        backgroundColor: "#e2e6ff",
                        fill: "#9e7eff",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 143
                    });
                    this.game.stage.addChild(this.playedText);
                    this.wonText = PhaserUtil.createText(this.game, {
                        positionX: 576,
                        positionY: 1002,
                        message: 'WON',
                        align: "center",
                        backgroundColor: "#e2e6ff",
                        fill: "#9e7eff",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 96
                    });
                    this.game.stage.addChild(this.wonText);
                    this.lostText = PhaserUtil.createText(this.game, {
                        positionX: 691,
                        positionY: 1002,
                        message: 'LOST',
                        align: "center",
                        backgroundColor: "#e2e6ff",
                        fill: "#9e7eff",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 94
                    });
                    this.game.stage.addChild(this.lostText);
                    this.drawText = PhaserUtil.createText(this.game, {
                        positionX: 804.5,
                        positionY: 1002,
                        message: 'DRAW',
                        align: "center",
                        backgroundColor: "#e2e6ff",
                        fill: "#9e7eff",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 119
                    });
                    this.game.stage.addChild(this.drawText);
                    this.friendsText = PhaserUtil.createText(this.game, {
                        positionX: 156,
                        positionY: 1110,
                        message: 'FRIENDS',
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 158
                    });
                    this.game.stage.addChild(this.friendsText);
                    this.randomText = PhaserUtil.createText(this.game, {
                        positionX: 156,
                        positionY: 1194,
                        message: 'RANDOM',
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 167
                    });
                    this.game.stage.addChild(this.randomText);
                    this.practiceText = PhaserUtil.createText(this.game, {
                        positionX: 156,
                        positionY: 1278,
                        message: 'PRACTICE',
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.practiceText);
                    this.totalText = PhaserUtil.createText(this.game, {
                        positionX: 156,
                        positionY: 1386,
                        message: 'TOTAL',
                        align: "center",
                        backgroundColor: "#fcf6e4",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 117
                    });
                    this.game.stage.addChild(this.totalText);
                    this.randomPlayedText = PhaserUtil.createText(this.game, {
                        positionX: 486,
                        positionY: 1218.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: (valueJSON.randomStats.won + valueJSON.randomStats.lost + valueJSON.randomStats.draw).toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.randomPlayedText);
                    this.randomWonText = PhaserUtil.createText(this.game, {
                        positionX: 624,
                        positionY: 1218.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: valueJSON.randomStats.won.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.randomWonText);
                    this.randomLostText = PhaserUtil.createText(this.game, {
                        positionX: 738,
                        positionY: 1218.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: valueJSON.randomStats.lost.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.randomLostText);
                    this.randomDrawText = PhaserUtil.createText(this.game, {
                        positionX: 864,
                        positionY: 1218.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: valueJSON.randomStats.draw.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.randomDrawText);
                    this.friendsPlayedText = PhaserUtil.createText(this.game, {
                        positionX: 486,
                        positionY: 1134.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: (valueJSON.friendsStats.won + valueJSON.friendsStats.lost + valueJSON.friendsStats.draw).toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.friendsPlayedText);
                    this.friendsWonText = PhaserUtil.createText(this.game, {
                        positionX: 624,
                        positionY: 1134.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: valueJSON.friendsStats.won.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.friendsWonText);
                    this.friendsLostText = PhaserUtil.createText(this.game, {
                        positionX: 738,
                        positionY: 1134.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: valueJSON.friendsStats.lost.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.friendsLostText);
                    this.friendsDrawText = PhaserUtil.createText(this.game, {
                        positionX: 864,
                        positionY: 1134.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: valueJSON.friendsStats.draw.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.friendsDrawText);
                    this.soloPlayedText = PhaserUtil.createText(this.game, {
                        positionX: 486,
                        positionY: 1302.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: (valueJSON.soloStats.won + valueJSON.soloStats.lost + valueJSON.soloStats.draw).toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.soloPlayedText);
                    this.soloWonText = PhaserUtil.createText(this.game, {
                        positionX: 624,
                        positionY: 1302.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: valueJSON.soloStats.won.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.soloWonText);
                    this.soloLostText = PhaserUtil.createText(this.game, {
                        positionX: 738,
                        positionY: 1302.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: valueJSON.soloStats.lost.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.soloLostText);
                    this.soloDrawText = PhaserUtil.createText(this.game, {
                        positionX: 864,
                        positionY: 1302.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: valueJSON.soloStats.draw.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.soloDrawText);
                    this.totalPlayedText = PhaserUtil.createText(this.game, {
                        positionX: 486,
                        positionY: 1410.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: (valueJSON.soloStats.won + valueJSON.soloStats.lost + valueJSON.soloStats.draw + valueJSON.friendsStats.won + valueJSON.friendsStats.lost + valueJSON.friendsStats.draw + valueJSON.randomStats.won + valueJSON.randomStats.lost + valueJSON.randomStats.draw).toString(),
                        align: "center",
                        backgroundColor: "#fcf6e4",
                        fill: "#f0a207",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.totalPlayedText);
                    this.totalWonText = PhaserUtil.createText(this.game, {
                        positionX: 624,
                        positionY: 1410.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: (valueJSON.soloStats.won + valueJSON.friendsStats.won + valueJSON.randomStats.won).toString(),
                        align: "center",
                        backgroundColor: "#fcf6e4",
                        fill: "#f0a207",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.totalWonText);
                    this.totalLostText = PhaserUtil.createText(this.game, {
                        positionX: 738,
                        positionY: 1410.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: (valueJSON.soloStats.lost + valueJSON.friendsStats.lost + valueJSON.randomStats.lost).toString(),
                        align: "center",
                        backgroundColor: "#fcf6e4",
                        fill: "#f0a207",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.totalLostText);
                    this.totalDrawText = PhaserUtil.createText(this.game, {
                        positionX: 864,
                        positionY: 1410.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        message: (valueJSON.soloStats.draw + valueJSON.friendsStats.draw + valueJSON.randomStats.draw).toString(),
                        align: "center",
                        backgroundColor: "#fcf6e4",
                        fill: "#f0a207",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.totalDrawText);
                }
            }.bind(this));
        }.bind(this));

    }

    cancelStats() {
        this.game.stage.removeChild(this.statsLogo);
        this.game.stage.removeChild(this.modeText);
        this.game.stage.removeChild(this.playedText);
        this.game.stage.removeChild(this.wonText);
        this.game.stage.removeChild(this.lostText);
        this.game.stage.removeChild(this.drawText);
        this.game.stage.removeChild(this.cancelButton);
        this.game.stage.removeChild(this.statsModal);
        this.game.stage.removeChild(this.darkOverlay);
        this.game.stage.removeChild(this.randomText);
        this.game.stage.removeChild(this.friendsText);
        this.game.stage.removeChild(this.practiceText);
        this.game.stage.removeChild(this.totalText);
        this.game.stage.removeChild(this.myStatsText);
        this.game.stage.removeChild(this.friendsPlayedText);
        this.game.stage.removeChild(this.friendsWonText);
        this.game.stage.removeChild(this.friendsDrawText);
        this.game.stage.removeChild(this.friendsLostText);
        this.game.stage.removeChild(this.randomPlayedText);
        this.game.stage.removeChild(this.randomDrawText);
        this.game.stage.removeChild(this.randomLostText);
        this.game.stage.removeChild(this.randomWonText);
        this.game.stage.removeChild(this.soloPlayedText);
        this.game.stage.removeChild(this.soloLostText);
        this.game.stage.removeChild(this.soloDrawText);
        this.game.stage.removeChild(this.soloWonText);
        this.game.stage.removeChild(this.totalPlayedText);
        this.game.stage.removeChild(this.totalDrawText);
        this.game.stage.removeChild(this.totalLostText);
        this.game.stage.removeChild(this.totalWonText);
        this.game.stage.removeChild(this.statsModeBackground);
        this.game.stage.removeChild(this.statsTotalBackground);
    }

};