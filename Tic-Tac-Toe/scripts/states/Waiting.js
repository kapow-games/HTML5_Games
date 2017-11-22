'use strict';
import phaserManager from "../util/phaserManager";
import globalVariableInstance from "../objects/gameGlobalVariables";
import Background from "../objects/Background";
import OnGoingGameButton from "../objects/OnGoingGameButton";
import BackButton from "../objects/BackButton";
import MusicButton from "../objects/MusicButton";
import HelpButton from "../objects/HelpButton";


export class Waiting extends Phaser.State {
    preload() {
        globalVariableInstance.set("screenState", 1);
        this.loadOpponentProfileImage();
    }

    create() {
        this.bg = new Background({
            phaserGameObj: this.game,
            posX: 0,
            posY: 0,
            label: 'arena',
            anchorX: 0,
            anchorY: 0
        });

        this.waitingPlayerBackground = this.game.add.image(48, 372, 'waitingPlayer');

        this.backButton = new BackButton({
            phaserGameObj: this.game,
            posX: 48,
            posY: 96,
            label: 'back',
            anchorX: 0,
            anchorY: 0,
            callback: this.backButtonHandler.bind(this)
        });

        this.musicButton = new MusicButton({
            phaserGameObj: this.game,
            posX: 960,
            posY: 96,
            label: 'music',
            anchorX: 0,
            anchorY: 0,
        });

        this.helpButton = new HelpButton({
            phaserGameObj: this.game,
            posX: 840,
            posY: 96,
            label: 'help',
            anchorX: 0,
            anchorY: 0,
        });

        this.waitingText = phaserManager.createText(this.game, {
            positionX: this.game.world.centerX,
            positionY: 780,
            messageToDisplay: '',
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

        this.createPlayerProfileImage();
        this.createOpponentProfileImage();

        this.activeGames = new OnGoingGameButton({
            phaserGameObj: this.game,
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

    }

    update() {

    }

    loadOpponentProfileImage() {
        if (globalVariableInstance.get("opponentData") !== undefined) {
            this.game.load.image('opponentPic', globalVariableInstance.get("opponentData").profileImage + "?height=276&width=276");
        }
    }

    backButtonHandler() {
        console.log("WebView BACK presed.");
        kapow.unloadRoom(function () {
            console.log('Room Succesfully Unloaded');
        }, function () {
            console.log('Room Unloading Failed');
        });
        globalVariableInstance.set("gameResume", false);
        globalVariableInstance.set("room", null);
        globalVariableInstance.set("playerMark", 0);
        globalVariableInstance.set("gameType", null);
        globalVariableInstance.set("botLevel", -1);
        globalVariableInstance.set("boardStatus", {cells: new Array(9)});
        globalVariableInstance.set("opponentData", undefined);
        globalVariableInstance.set("turnOfPlayer", undefined);
        globalVariableInstance.set("gameOver", false);
        globalVariableInstance.set("win", 0);
        globalVariableInstance.set("gameLayoutLoaded", false);
        this.game.state.start('menu');
    }

    createPlayerProfileImage() {
        this.playerProfilePic = this.game.add.image(222, 444, 'profilePic');
        this.playerProfilePic.scale.set(276 / this.playerProfilePic.width);

        //To achieve circular image
        this.playerMask = this.game.add.graphics(0, 0);
        this.playerMask.beginFill("#f0f0f0");
        this.playerMask.drawCircle(360, 582, 276);
        this.playerProfilePic.mask = this.playerMask;
    }

    createOpponentProfileImage() {
        if (globalVariableInstance.get("opponentData") !== undefined) {
            this.opponentProfilePic = this.game.add.image(582, 444, "opponentPic");
            this.opponentProfilePic.scale.set(276 / this.opponentProfilePic.width);

            //To achieve circular image
            this.opponentMask = this.game.add.graphics(0, 0);
            this.opponentMask.beginFill("#f0f0f0");
            this.opponentMask.drawCircle(720, 582, 276);
            this.opponentProfilePic.mask = this.opponentMask;

            console.log('opponentData at waiting state : ', globalVariableInstance.get("opponentData"));
            this.waitingText.text = "WAITING FOR " + globalVariableInstance.get("opponentData").name.split(" ")[0].toUpperCase() + " TO JOIN";
        }
        else {
            //placeHolder opponentImage {for Random Room}
            this.opponentProfilePic = this.game.add.image(654, 492, "anonymousOpponentPic");
            this.opponentProfilePic.scale.set(132 / this.opponentProfilePic.width);
            this.waitingText.text = "WAITING FOR AN OPPONENT";
        }
    }

}
