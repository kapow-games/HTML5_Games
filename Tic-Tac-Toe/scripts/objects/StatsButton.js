import DarkOverlay from './DarkOverLay';
import phaserManager from '../util/phaserManager';

export default class StatsButton extends Phaser.Button {
    constructor(obj) {
        let _posX = obj.posX;
        let _posY = obj.posY;
        let _label = obj.label;
        let _anchorX = obj.anchorX;
        let _anchorY = obj.anchorY;
        let _overFrame = obj.overFrame;
        let _outFrame = obj.outFrame;
        let _downFrame = obj.downFrame;
        let _upFrame = obj.upFrame;

        super(obj.phaserGameObj, _posX, _posY, _label, () => this.statButtonClickHandler, () => this, _overFrame, _outFrame, _downFrame, _upFrame);

        this.bg = obj.bg;
        this.phaserGame = obj.phaserGameObj;
        this.anchor.setTo(_anchorX, _anchorY);
    }

    statButtonClickHandler() {
        this.darkOverlay = new DarkOverlay({
            phaserGameObj: this.phaserGame,
            posX: 0,
            posY: 0,
            label: 'darkOverlay',
            anchorX: 0,
            anchorY: 0,
            inputEnabled: true,
            clickHandler: this.cancelStats.bind(this)
        });
        this.bg.setInputEnabled(true);
        this.bg.setInputPriority(2);

        this.statsModal = this.phaserGame.add.sprite(540, 961.5, 'statsBackground');
        this.statsModal.inputEnabled = true;
        this.statsModal.input.priorityID = 3;
        this.statsModal.anchor.setTo(0.5);

        //Stats Modal Animation
        this.statsModal.scale.setTo(0);
        this.popUpStatsModal = this.add.tween(this.statsModal.scale).to({x: 1, y: 1}, 600, "Quart.easeOut");
        this.popUpStatsModal.start();
        this.popUpStatsModal.onComplete.add(function () {
            this.bg.input.priorityID = 1;
            this.bg.inputEnabled = false;
            this.darkOverlay.input.priorityID = 2;

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

            var that = this;
            kapow.gameStore.get('stats', function (statsValue) {
                    console.log("gameStore fetch - Success.");
                    if (statsValue) {
                        console.log("Value fetched from gameStore was : ", statsValue);
                        let valueJSON = JSON.parse(statsValue);
                        that.statsModeBackground = that.phaserGame.add.sprite(120, 978, 'modeBackground');

                        that.statsTotalBackground = that.phaserGame.add.sprite(120, 1362, 'statsTotalBackground');

                        that.modeText = phaserManager.createText(that.phaserGame, {
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

                        that.playedText = phaserManager.createText(that.phaserGame, {
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

                        that.wonText = phaserManager.createText(that.phaserGame, {
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

                        that.lostText = phaserManager.createText(that.phaserGame, {
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

                        that.drawText = phaserManager.createText(that.phaserGame, {
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

                        that.friendsText = phaserManager.createText(that.phaserGame, {
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

                        that.randomText = phaserManager.createText(that.phaserGame, {
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

                        that.practiceText = phaserManager.createText(that.phaserGame, {
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

                        that.totalText = phaserManager.createText(that.phaserGame, {
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

                        that.randomPlayedText = phaserManager.createText(that.phaserGame, {
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

                        that.randomWonText = phaserManager.createText(that.phaserGame, {
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

                        that.randomLostText = phaserManager.createText(that.phaserGame, {
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

                        that.randomDrawText = phaserManager.createText(that.phaserGame, {
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


                        that.friendsPlayedText = phaserManager.createText(that.phaserGame, {
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

                        that.friendsWonText = phaserManager.createText(that.phaserGame, {
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

                        that.friendsLostText = phaserManager.createText(that.phaserGame, {
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

                        that.friendsDrawText = phaserManager.createText(that.phaserGame, {
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

                        that.soloPlayedText = phaserManager.createText(that.phaserGame, {
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

                        that.soloWonText = phaserManager.createText(that.phaserGame, {
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

                        that.soloLostText = phaserManager.createText(that.phaserGame, {
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

                        that.soloDrawText = phaserManager.createText(that.phaserGame, {
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

                        that.totalPlayedText = phaserManager.createText(that.phaserGame, {
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

                        that.totalWonText = phaserManager.createText(that.phaserGame, {
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

                        that.totalLostText = phaserManager.createText(that.phaserGame, {
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

                        that.totalDrawText = phaserManager.createText(that.phaserGame, {
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
                },
                function (error) {
                    console.log("stats data fetch from gameStore failed with error :", error);
                });
        }, this);
        console.log('Stat handler funtion implemented');
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
        this.darkOverlay.destroy();
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