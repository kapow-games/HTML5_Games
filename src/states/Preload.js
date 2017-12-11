'use strict';

import gameInfo from "../objects/store/GameInfo";
import GamePlayUtil from "../util/GamePlayUtil";
import kapowGameStore from "../objects/store/KapowGameStore";
import GameManager from "../controller/GameManager";

var WebFontConfig = {
    active: function () {
        phaserGame.time.events.add(Phaser.Timer.SECOND, createText, this);
    }
};

export class Preload extends Phaser.State {
    preload() {
        console.log(gameInfo);
        this.ready = false;
        console.log("Preloading Assets");
        this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        this.add.text(0, 0, "fontFix", {font: "1px nunito-regular", fill: "#000000"});
        this.asset = this.add.sprite(this.world.centerX, this.world.centerY, "loading");
        this.asset.anchor.setTo(0.5, 0.5);
        this.load.onLoadComplete.addOnce(this._onLoadComplete, this);
        this.load.setPreloadSprite(this.asset);
        this.load.image('profilePic', gameInfo.get("playerData").profileImage + "?height=276&width=276");
        this.load.image('modeBackground', 'assets/images/statsModeHeader.png');
        this.load.image('statsBackground', 'assets/images/statsBackground.png');
        this.load.image('statsTotalBackground', 'assets/images/statsTotalBackground.png');
        this.load.image('statsClose', 'assets/images/statsClose.png');
        this.load.image('statsLogo', 'assets/images/statsLogo.png');
        this.load.image('botPic', 'assets/images/botPic.png');
        this.load.image('logo', 'assets/images/logo.png');
        this.load.spritesheet('onGoing', 'assets/images/onGoing.png', 984, 180);
        this.load.image('arena', 'assets/images/backGround.png');
        this.load.image('back', 'assets/images/back.png');
        this.load.image('kapowClose', 'assets/images/kapowClose.png');
        this.load.spritesheet('newGameTop', 'assets/images/newgame-top.png', 984, 108);
        this.load.spritesheet('newGameBottom', 'assets/images/newgame-bottom.png', 984, 114);
        this.load.spritesheet('music', 'assets/images/volume.png', 72, 72);
        this.load.spritesheet('leaderBoard', 'assets/images/leaderboard.png', 984, 138);
        this.load.spritesheet('stats', 'assets/images/stats.png', 984, 138);
        this.load.image('turnTextBackground', 'assets/images/turnBoard.png');
        this.load.image('circle', 'assets/images/circle.png');
        this.load.image('board', 'assets/images/board.png');
        this.load.image('mark_selected', 'assets/images/mark-selected.png');
        this.load.image('startbutton_disabled', 'assets/images/startbutton-disabled.png');
        this.load.image('resignModal', 'assets/images/resign-modal.png');
        this.load.image('yesResign', 'assets/images/yes-resign.png');
        this.load.image('cancel', 'assets/images/cancel.png');
        this.load.image('shareBackground', 'assets/images/share-bg.png');
        this.load.image('fbShare', 'assets/images/fb.png');
        this.load.spritesheet('winBackground', 'assets/images/resultBackground.png', 456, 153);
        this.load.spritesheet('resignBackground', 'assets/images/resignResultBackground.png', 456, 189);
        this.load.image('confetti', 'assets/images/confetti.png');
        this.load.image('twitterShare', 'assets/images/twitter.png');
        this.load.image('otherShare', 'assets/images/other.png');
        this.load.image('darkOverlay', 'assets/images/dark-overlay.png');
        this.load.image('shareLoadBackground', 'assets/images/shareLoadBackground.png');
        this.load.image('arrowRight', 'assets/images/arrowRight.png');
        this.load.image('waitingPlayer', 'assets/images/waitingPlayer.png');
        this.load.image('anonymousOpponentPic', 'assets/images/waitingOpponent.png');
        this.load.image('loaderSpinner', 'assets/images/loader_tictac.png');
        this.load.spritesheet('startbutton', 'assets/images/startbutton.png', 630, 138);
        this.load.spritesheet('gameModes', 'assets/images/game-modes.png', 328, 84);
        this.load.spritesheet('rematch', 'assets/images/rematchbutton.png', 351, 120);
        this.load.image('credit', 'assets/images/credit.png');
        this.load.image('creditsLogo', 'assets/images/creditsLogo.png');
        this.load.image('creditsModal', 'assets/images/creditsModal.png');
        this.load.image('rectangle', 'assets/images/rectangle.png');
        this.load.spritesheet('helpEnd', 'assets/images/helpEnd.png', 120, 120);
        this.load.spritesheet('help', 'assets/images/helpStart.png', 72, 72);
        this.load.spritesheet('resign', 'assets/images/resignbutton.png', 303, 120);
        this.load.image('helpClose', 'assets/images/helpClose.png');
        this.load.image('howToPlay', 'assets/images/howtoplay.png');
        this.load.image('bubbleDot', 'assets/images/bubbleDot.png');
        this.load.image('choose_bg_mark', 'assets/images/mark-choose.png');
        this.load.spritesheet('cell', 'assets/images/xo-sprite.png', 264, 264);
        this.load.audio('gameSound', 'assets/audio/Robobozo.mp3');
        this.load.audio('winSound', 'assets/audio/Tada.mp3');
        this.load.audio('tapSound', 'assets/audio/Tap.mp3');
    }

    create() {
        this.asset.cropEnabled = false;
    }

    update() {
        if (this.ready) { // TODO : fix later  simplify condition
            if (gameInfo.get("gameResume") === true) {
                if (gameInfo.get("gameType") === "solo") {
                    GameManager.startState('Play');
                }
                else if (gameInfo.get("gameType") === "friend") {
                    GamePlayUtil.parseRoomAndRedirectToGame(); // TODO . Can u pass arguments via starting State in phaser. trigger flow view play.js .
                }
            }
            else {
                this.state.start('Menu');
            }
        }
    }

    _onLoadComplete() {
        this.sound = this.game.add.audio('gameSound');
        this.winSound = this.game.add.audio('winSound');
        this.tapSound = this.game.add.audio('tapSound');
        this.game.sound.setDecodedCallback([this.sound, this.winSound, this.tapSound], this._start, this);
    }

    _start() {
        kapowGameStore.get("music", function (args, self) {
            console.log("gameStore fetch - Success.");
            this.sound.play();
            this.sound.mute = true;
            if (args) {
                console.log("Value fetched from gameStore was : ", args);
            }
            else {
                this.sound.mute = true;
                let param = {
                    volume: 1,
                };
                self.set("music", param);
            }
            this.sound.loop = true;
            this.ready = true;
            console.log(this);
        }.bind(this));
    }
}