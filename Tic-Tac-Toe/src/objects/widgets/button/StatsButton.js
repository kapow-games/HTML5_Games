import DarkOverlay from './DarkOverLay';
import phaserManager from '../../../util/phaserManager';
import GameStoreQuery from "../../store/GameStoreQuery";

export default class StatsButton extends Phaser.Button {
    constructor(obj) {
        super(obj.game, obj.posX, obj.posY, obj.label, () => this.statButtonClickHandler, () => this, obj.overFrame, obj.outFrame, obj.downFrame, obj.upFrame);
        this.bg = obj.bg;
        this.phaserGame = obj.game;
        this.anchor.setTo(obj.anchorX, obj.anchorY);
    }

    statButtonClickHandler() {
        console.log('Stat Button Clicked.');
        this.darkOverlay = new DarkOverlay({
            game: this.phaserGame,
            posX: 0,
            posY: 0,
            label: 'darkOverlay',
            anchorX: 0,
            anchorY: 0,
            inputEnabled: true,
            clickHandler: this.cancelStats.bind(this)
        });
        this.bg.enableInput(true);
        this.bg.setInputPriority(2);
        this.createStatsModal();
    }

    createStatsModal() {
        this.statsModal = this.phaserGame.add.sprite(540, 961.5, 'statsBackground');
        this.statsModal.inputEnabled = true;
        this.statsModal.input.priorityID = 3;
        this.statsModal.anchor.setTo(0.5);
        //Animate and open modal
        this.statsModal.scale.setTo(0);
        this.popUpStatsModal = this.add.tween(this.statsModal.scale).to({x: 1, y: 1}, 600, "Quart.easeOut");
        this.popUpStatsModal.start();

        this.fillStatsValues();
    }

    fillStatsValues() {
        this.popUpStatsModal.onComplete.add(function () {
            this.bg.setInputPriority(1);
            this.bg.enableInput(false);
            this.darkOverlay.setInputPriority(2);

            this.statsLogo = this.phaserGame.add.sprite(360, 465, 'statsLogo');

            this.myStatsText = phaserManager.createText(this.phaserGame, {
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

            this.cancelButton = this.phaserGame.add.button(888, 441, 'statsClose', this.cancelStats, this);
            this.cancelButton.inputEnabled = true;
            this.cancelButton.input.priorityID = 4;

            let gameStoreContainer = new GameStoreQuery();
            gameStoreContainer.get("stats", function (statsValue, self) {
                console.log("gameStore fetch - Success.");
                if (statsValue) {
                    console.log("Value fetched from gameStore was : ", statsValue);
                    let valueJSON = JSON.parse(statsValue);
                    this.statsModeBackground = this.phaserGame.add.sprite(120, 978, 'modeBackground');

                    this.statsTotalBackground = this.phaserGame.add.sprite(120, 1362, 'statsTotalBackground');

                    this.modeText = phaserManager.createText(this.phaserGame, {
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

                    this.playedText = phaserManager.createText(this.phaserGame, {
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

                    this.wonText = phaserManager.createText(this.phaserGame, {
                        positionX: 576,
                        positionY: 1002,
                        messageToDisplay: 'WON',
                        align: "center",
                        backgroundColor: "e2e6ff",
                        fill: "#9e7eff",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 96
                    });

                    this.lostText = phaserManager.createText(this.phaserGame, {
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

                    this.drawText = phaserManager.createText(this.phaserGame, {
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

                    this.friendsText = phaserManager.createText(this.phaserGame, {
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

                    this.randomText = phaserManager.createText(this.phaserGame, {
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

                    this.practiceText = phaserManager.createText(this.phaserGame, {
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

                    this.totalText = phaserManager.createText(this.phaserGame, {
                        positionX: 156,
                        positionY: 1386,
                        messageToDisplay: 'TOTAL',
                        align: "center",
                        backgroundColor: "#fefefe",
                        fill: "#7a797a",
                        font: 'nunito-regular',
                        fontSize: "36px",
                        fontWeight: 800,
                        wordWrapWidth: 117
                    });

                    this.randomPlayedText = phaserManager.createText(this.phaserGame, {
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

                    this.randomWonText = phaserManager.createText(this.phaserGame, {
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

                    this.randomLostText = phaserManager.createText(this.phaserGame, {
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

                    this.randomDrawText = phaserManager.createText(this.phaserGame, {
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


                    this.friendsPlayedText = phaserManager.createText(this.phaserGame, {
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

                    this.friendsWonText = phaserManager.createText(this.phaserGame, {
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

                    this.friendsLostText = phaserManager.createText(this.phaserGame, {
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

                    this.friendsDrawText = phaserManager.createText(this.phaserGame, {
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

                    this.soloPlayedText = phaserManager.createText(this.phaserGame, {
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

                    this.soloWonText = phaserManager.createText(this.phaserGame, {
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

                    this.soloLostText = phaserManager.createText(this.phaserGame, {
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

                    this.soloDrawText = phaserManager.createText(this.phaserGame, {
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

                    this.totalPlayedText = phaserManager.createText(this.phaserGame, {
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

                    this.totalWonText = phaserManager.createText(this.phaserGame, {
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

                    this.totalLostText = phaserManager.createText(this.phaserGame, {
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

                    this.totalDrawText = phaserManager.createText(this.phaserGame, {
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
                }
            }.bind(this));
        }.bind(this));

    }

    cancelStats() {
        this.statsLogo.destroy();
        this.modeText.destroy();
        this.playedText.destroy();
        this.wonText.destroy();
        this.lostText.destroy();
        this.drawText.destroy();
        this.cancelButton.destroy();
        this.statsModal.destroy();
        this.darkOverlay.destroyButton();
        this.randomText.destroy();
        this.friendsText.destroy();
        this.practiceText.destroy();
        this.totalText.destroy();
        this.myStatsText.destroy();
        this.friendsPlayedText.destroy();
        this.friendsWonText.destroy();
        this.friendsLostText.destroy();
        this.friendsDrawText.destroy();
        this.randomPlayedText.destroy();
        this.randomWonText.destroy();
        this.randomLostText.destroy();
        this.randomDrawText.destroy();
        this.soloPlayedText.destroy();
        this.soloWonText.destroy();
        this.soloLostText.destroy();
        this.soloDrawText.destroy();
        this.totalPlayedText.destroy();
        this.totalWonText.destroy();
        this.totalLostText.destroy();
        this.totalDrawText.destroy();
        this.statsModeBackground.destroy();
        this.statsTotalBackground.destroy();
    }

}