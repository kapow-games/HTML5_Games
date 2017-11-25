import DarkOverlay from './DarkOverLay';
import phaserManager from '../../../util/phaserManager';
import GameStoreQuery from "../../store/GameStoreQuery";

export default class StatsButton extends Phaser.Button {
    constructor(arg) {
        let statButtonClickHandler = function () {
            console.log('Stat Button Clicked.');
            this.darkOverlay = new DarkOverlay({
                game: this.game,
                posX: 0,
                posY: 0,
                label: 'darkOverlay',
                anchorX: 0,
                anchorY: 0,
                inputEnabled: true,
                clickHandler: this.cancelStats.bind(this)
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
        //Animate and open modal
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

            this.myStatsText = phaserManager.createText(this.game, {
                positionX: 394.5,
                positionY: 848,
                messageToDisplay: 'MY STATS',
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

            let gameStoreContainer = new GameStoreQuery();
            gameStoreContainer.get("stats", function (statsValue, self) {
                console.log("gameStore fetch - Success.");
                if (statsValue) {
                    console.log("Value fetched from gameStore was : ", statsValue);
                    let valueJSON = JSON.parse(statsValue);
                    this.statsModeBackground = this.game.add.sprite(120, 978, 'modeBackground');
                    this.game.stage.addChild(this.statsModeBackground);
                    this.statsTotalBackground = this.game.add.sprite(120, 1362, 'statsTotalBackground');
                    this.game.stage.addChild(this.statsTotalBackground);
                    this.modeText = phaserManager.createText(this.game, {
                        positionX: 156,
                        positionY: 1002,
                        messageToDisplay: 'MODE',
                        align: "center",
                        backgroundColor: "#e2e6ff",
                        fill: "#9e7eff",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 109
                    });
                    this.game.stage.addChild(this.modeText);
                    this.playedText = phaserManager.createText(this.game, {
                        positionX: 414.5,
                        positionY: 1002,
                        messageToDisplay: 'PLAYED',
                        align: "center",
                        backgroundColor: "#e2e6ff",
                        fill: "#9e7eff",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 143
                    });
                    this.game.stage.addChild(this.playedText);
                    this.wonText = phaserManager.createText(this.game, {
                        positionX: 576,
                        positionY: 1002,
                        messageToDisplay: 'WON',
                        align: "center",
                        backgroundColor: "#e2e6ff",
                        fill: "#9e7eff",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 96
                    });
                    this.game.stage.addChild(this.wonText);
                    this.lostText = phaserManager.createText(this.game, {
                        positionX: 691,
                        positionY: 1002,
                        messageToDisplay: 'LOST',
                        align: "center",
                        backgroundColor: "#e2e6ff",
                        fill: "#9e7eff",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 94
                    });
                    this.game.stage.addChild(this.lostText);
                    this.drawText = phaserManager.createText(this.game, {
                        positionX: 804.5,
                        positionY: 1002,
                        messageToDisplay: 'DRAW',
                        align: "center",
                        backgroundColor: "#e2e6ff",
                        fill: "#9e7eff",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 119
                    });
                    this.game.stage.addChild(this.drawText);
                    this.friendsText = phaserManager.createText(this.game, {
                        positionX: 156,
                        positionY: 1110,
                        messageToDisplay: 'FRIENDS',
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 158
                    });
                    this.game.stage.addChild(this.friendsText);
                    this.randomText = phaserManager.createText(this.game, {
                        positionX: 156,
                        positionY: 1194,
                        messageToDisplay: 'RANDOM',
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 167
                    });
                    this.game.stage.addChild(this.randomText);
                    this.practiceText = phaserManager.createText(this.game, {
                        positionX: 156,
                        positionY: 1278,
                        messageToDisplay: 'PRACTICE',
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.practiceText);
                    this.totalText = phaserManager.createText(this.game, {
                        positionX: 156,
                        positionY: 1386,
                        messageToDisplay: 'TOTAL',
                        align: "center",
                        backgroundColor: "#fcf6e4",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 117
                    });
                    this.game.stage.addChild(this.totalText);
                    this.randomPlayedText = phaserManager.createText(this.game, {
                        positionX: 486,
                        positionY: 1218.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: (valueJSON.randomStats.won + valueJSON.randomStats.lost + valueJSON.randomStats.draw).toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.randomPlayedText);
                    this.randomWonText = phaserManager.createText(this.game, {
                        positionX: 624,
                        positionY: 1218.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: valueJSON.randomStats.won.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.randomWonText);
                    this.randomLostText = phaserManager.createText(this.game, {
                        positionX: 738,
                        positionY: 1218.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: valueJSON.randomStats.lost.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.randomLostText);
                    this.randomDrawText = phaserManager.createText(this.game, {
                        positionX: 864,
                        positionY: 1218.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: valueJSON.randomStats.draw.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.randomDrawText);
                    this.friendsPlayedText = phaserManager.createText(this.game, {
                        positionX: 486,
                        positionY: 1134.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: (valueJSON.friendsStats.won + valueJSON.friendsStats.lost + valueJSON.friendsStats.draw).toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.friendsPlayedText);
                    this.friendsWonText = phaserManager.createText(this.game, {
                        positionX: 624,
                        positionY: 1134.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: valueJSON.friendsStats.won.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.friendsWonText);
                    this.friendsLostText = phaserManager.createText(this.game, {
                        positionX: 738,
                        positionY: 1134.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: valueJSON.friendsStats.lost.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.friendsLostText);
                    this.friendsDrawText = phaserManager.createText(this.game, {
                        positionX: 864,
                        positionY: 1134.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: valueJSON.friendsStats.draw.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.friendsDrawText);
                    this.soloPlayedText = phaserManager.createText(this.game, {
                        positionX: 486,
                        positionY: 1302.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: (valueJSON.soloStats.won + valueJSON.soloStats.lost + valueJSON.soloStats.draw).toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.soloPlayedText);
                    this.soloWonText = phaserManager.createText(this.game, {
                        positionX: 624,
                        positionY: 1302.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: valueJSON.soloStats.won.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.soloWonText);
                    this.soloLostText = phaserManager.createText(this.game, {
                        positionX: 738,
                        positionY: 1302.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: valueJSON.soloStats.lost.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.soloLostText);
                    this.soloDrawText = phaserManager.createText(this.game, {
                        positionX: 864,
                        positionY: 1302.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: valueJSON.soloStats.draw.toString(),
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.soloDrawText);
                    this.totalPlayedText = phaserManager.createText(this.game, {
                        positionX: 486,
                        positionY: 1410.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: (valueJSON.soloStats.won + valueJSON.soloStats.lost + valueJSON.soloStats.draw + valueJSON.friendsStats.won + valueJSON.friendsStats.lost + valueJSON.friendsStats.draw + valueJSON.randomStats.won + valueJSON.randomStats.lost + valueJSON.randomStats.draw).toString(),
                        align: "center",
                        backgroundColor: "#fcf6e4",
                        fill: "#f0a207",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.totalPlayedText);
                    this.totalWonText = phaserManager.createText(this.game, {
                        positionX: 624,
                        positionY: 1410.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: (valueJSON.soloStats.won + valueJSON.friendsStats.won + valueJSON.randomStats.won).toString(),
                        align: "center",
                        backgroundColor: "#fcf6e4",
                        fill: "#f0a207",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.totalWonText);
                    this.totalLostText = phaserManager.createText(this.game, {
                        positionX: 738,
                        positionY: 1410.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: (valueJSON.soloStats.lost + valueJSON.friendsStats.lost + valueJSON.randomStats.lost).toString(),
                        align: "center",
                        backgroundColor: "#fcf6e4",
                        fill: "#f0a207",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 181
                    });
                    this.game.stage.addChild(this.totalLostText);
                    this.totalDrawText = phaserManager.createText(this.game, {
                        positionX: 864,
                        positionY: 1410.5,
                        anchorX: 0.5,
                        anchorY: 0.5,
                        messageToDisplay: (valueJSON.soloStats.draw + valueJSON.friendsStats.draw + valueJSON.randomStats.draw).toString(),
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