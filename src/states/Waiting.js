'use strict';

import TextUtil from "../util/TextUtil";
import gameInfo from "../objects/store/GameInfo";
import Background from "../objects/widgets/icons/Background";
import OnGoingGameButton from "../objects/widgets/button/OnGoingGameButton";
import BackButton from "../objects/widgets/button/BackButton";
import MusicButton from "../objects/widgets/button/MusicButton";
import HelpButton from "../objects/widgets/button/HelpButton";
import GAME_CONST from "../const/GAME_CONST";

export class Waiting extends Phaser.State {
    preload() {
        gameInfo.set("screenState", 1);
        console.log(gameInfo.get("opponentData"));
        this.loadOpponentProfileImage();
    }

    create() {
        this.bg = new Background({
            game: this.game,
            posX: 0,
            posY: 0,
            label: 'arena',
            anchorX: 0,
            anchorY: 0
        });
        this.game.stage.addChild(this.bg);

        this.waitingPlayerBackground = this.game.add.image(48, 372, 'waitingPlayer');
        this.game.stage.addChild(this.waitingPlayerBackground);

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

        this.musicButton = new MusicButton({
            game: this.game,
            posX: 960,
            posY: 96,
            label: 'music',
            anchorX: 0,
            anchorY: 0,
        });
        this.game.stage.addChild(this.musicButton);

        this.helpButton = new HelpButton({
            game: this.game,
            posX: 840,
            posY: 96,
            label: 'help',
            anchorX: 0,
            anchorY: 0,
            bg: this.bg
        });
        this.game.stage.addChild(this.helpButton);

        this.waitingText = TextUtil.createText(this.game, {
            positionX: this.game.world.centerX,
            positionY: 780,
            message: '',
            align: "center",
            backgroundColor: "#ffffff",
            fill: "#6d616d",
            font: 'nunito-regular',
            fontSize: "60px",
            fontWeight: 800,
            wordWrapWidth: 355,
            anchorX: 0.5,
            anchorY: 0,
        });
        this.game.stage.addChild(this.waitingText);

        this.createPlayerProfileImage();
        this.createOpponentProfileImage();

        this.onGoingGame = new OnGoingGameButton({
            game: this.game,
            posX: 48,
            posY: 942,
            label: 'onGoing',
            anchorX: 0,
            anchorY: 0,
            overFrame: 0,
            outFrame: 0,
            downFrame: 1,
            upFrame: 0
        });
        this.game.stage.addChild(this.onGoingGame);

    }

    update() {

    }

    shutdown() {
        this.game.stage.removeChild(this.helpButton);
        this.game.stage.removeChild(this.bg);
        this.game.stage.removeChild(this.musicButton);
        this.game.stage.removeChild(this.backButton);
        this.game.stage.removeChild(this.waitingText);
        this.game.stage.removeChild(this.onGoingGame);
        this.game.stage.removeChild(this.waitingPlayerBackground);
        this.game.stage.removeChild(this.playerProfilePic);
        this.game.stage.removeChild(this.playerMask);
        this.game.stage.removeChild(this.opponentProfilePic);
        this.game.stage.removeChild(this.opponentMask);
    }

    loadOpponentProfileImage() {
        if (gameInfo.get("opponentData")) {
            this.game.load.image('opponentPic', gameInfo.get("opponentData").profileImage + "?height=276&width=276");
        }
    }

    backButtonHandler() {
        console.log("WebView BACK presed.");
        kapow.unloadRoom(function () {
            console.log('Room Succesfully Unloaded');
        }, function () {
            console.log('Room Unloading Failed');
        });
        gameInfo.set("gameResume", false);
        gameInfo.set("room", null);
        gameInfo.set("playerMark", GAME_CONST.TURN.NONE);
        gameInfo.set("gameType", null);
        gameInfo.set("botLevel", -1);
        let tempCells = [];
        for (let i = 0; i < GAME_CONST.TURN.CELL_COUNT; i++) {
            tempCells.push(undefined);
        }
        gameInfo.set("boardStatus", {cells: tempCells});
        gameInfo.set("opponentData", undefined);
        gameInfo.set("turnOfPlayer", undefined);
        gameInfo.set("gameOver", false);
        gameInfo.set("win", 0);
        gameInfo.set("gameLayoutLoaded", false);
        this.game.state.start('Menu');
    }

    createPlayerProfileImage() {
        this.playerProfilePic = this.game.add.image(222, 444, 'profilePic');
        this.playerProfilePic.scale.set(276 / this.playerProfilePic.width);
        this.game.stage.addChild(this.playerProfilePic);

        //To achieve circular image
        this.playerMask = this.game.add.graphics(0, 0);
        this.playerMask.beginFill("#f0f0f0");
        this.playerMask.drawCircle(360, 582, 276);
        this.playerProfilePic.mask = this.playerMask;
        this.game.stage.addChild(this.playerMask);
    }

    createOpponentProfileImage() {
        if (gameInfo.get("opponentData")) {
            this.opponentProfilePic = this.game.add.image(582, 444, "opponentPic");
            this.opponentProfilePic.scale.set(276 / this.opponentProfilePic.width);
            this.game.stage.addChild(this.opponentProfilePic);

            //To achieve circular image
            this.opponentMask = this.game.add.graphics(0, 0);
            this.opponentMask.beginFill("#f0f0f0");
            this.opponentMask.drawCircle(720, 582, 276);
            this.opponentProfilePic.mask = this.opponentMask;
            this.game.stage.addChild(this.opponentMask);

            console.log('opponentData at waiting state : ', gameInfo.get("opponentData"));
            this.waitingText.text = "WAITING FOR " + gameInfo.get("opponentData").name.split(" ")[0].toUpperCase() + " TO JOIN";
        }
        else {
            //placeHolder opponentImage {for Random Room}
            this.opponentProfilePic = this.game.add.image(654, 492, "anonymousOpponentPic");
            this.opponentProfilePic.scale.set(132 / this.opponentProfilePic.width);
            this.game.stage.addChild(this.opponentProfilePic);
            this.waitingText.text = "WAITING FOR AN OPPONENT";
        }
    }

}
